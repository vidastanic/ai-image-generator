import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../../src/types';

const mocks = vi.hoisted(() => ({
    generate: vi.fn(), upload: vi.fn(), remove: vi.fn(), values: vi.fn(), insert: vi.fn(),
}));
vi.mock('../../src/utils/openai-utils', () => ({ generateImageFromTextUtil: mocks.generate }));
vi.mock('../../src/utils/s3-utils', () => ({ uploadImageFromUrl: mocks.upload, deleteImageObject: mocks.remove }));
vi.mock('../../src/config/database', () => ({ db: { insert: mocks.insert } }));
import { generateImageFromText } from '../../src/controllers/image-generator-controller';

function request() {
    return { body: { prompt: 'An example illustration' }, user: { id: 'user-1' } } as AuthenticatedRequest;
}
function response() {
    return { json: vi.fn(), status: vi.fn().mockReturnThis() } as unknown as Response;
}

beforeEach(() => {
    vi.resetAllMocks();
    mocks.generate.mockResolvedValue('https://example.com/generated.png');
    mocks.upload.mockResolvedValue({});
    mocks.remove.mockResolvedValue({});
    mocks.insert.mockReturnValue({ values: mocks.values });
    mocks.values.mockResolvedValue(undefined);
});

describe('image persistence', () => {
    it('does not report success or insert a row until upload finishes', async () => {
        let finish!: () => void;
        mocks.upload.mockReturnValue(new Promise<void>(resolve => { finish = resolve; }));
        const res = response();
        const next = vi.fn();
        const pending = generateImageFromText(request(), res, next);
        await vi.waitFor(() => expect(mocks.upload).toHaveBeenCalledOnce());
        expect(mocks.insert).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        finish();
        await pending;
        const record = mocks.values.mock.calls[0][0];
        expect(mocks.upload).toHaveBeenCalledWith('https://example.com/generated.png', `v1/prod/generated/user-1/${record.id}.png`);
        expect(res.json).toHaveBeenCalledWith({ success: true, generatedImageUrl: 'https://example.com/generated.png' });
        expect(next).not.toHaveBeenCalled();
    });

    it('upload failure leaves no gallery row and returns no success', async () => {
        const error = new Error('Upload failed');
        mocks.upload.mockRejectedValue(error);
        const res = response(); const next = vi.fn();
        await generateImageFromText(request(), res, next);
        expect(mocks.insert).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(error);
    });

    it('removes the uploaded object if recording it fails', async () => {
        const error = new Error('Database failed');
        mocks.values.mockRejectedValue(error);
        const res = response(); const next = vi.fn();
        await generateImageFromText(request(), res, next);
        expect(mocks.remove).toHaveBeenCalledWith(mocks.upload.mock.calls[0][1]);
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(error);
    });

    it('does not upload or insert when generation fails', async () => {
        mocks.generate.mockRejectedValue(new Error('Provider failed'));
        const next = vi.fn();
        await generateImageFromText(request(), response(), next);
        expect(mocks.upload).not.toHaveBeenCalled();
        expect(mocks.insert).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledOnce();
    });

    it('rejects blank prompts before calling the provider', async () => {
        const req = request(); req.body.prompt = '   ';
        const next = vi.fn();
        await generateImageFromText(req, response(), next);
        expect(mocks.generate).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledOnce();
    });
});
