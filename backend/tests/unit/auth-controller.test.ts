import {beforeEach, describe, expect, it, vi, Mock} from "vitest";
import {NextFunction, Request, Response} from "express";
import {loginUser, registerUser} from "../../src/controllers";
import {ZodError} from "zod";
import * as userModel from "../../src/models/user.model";

vi.mock("../../src/utils", () => ({
    signJwtToken: vi.fn().mockReturnValue("SignedToken"),
    verifyJwtToken: vi.fn()
}));

vi.mock('bcryptjs', () => {
    const mockHash = vi.fn().mockResolvedValue("hashedPassword");

    return {
        default: {
            hash: mockHash,
            compare: vi.fn().mockImplementation(async (a, b) => (await mockHash(a)) === b),
        }
    }
});

vi.mock('../../src/models/user.model', () => ({
    fetchUsersByEmail: vi.fn(),
    createUser: vi.fn()
}));

describe("Auth Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        req = { body: {} };
        res = {
            status: vi.fn().mockReturnThis(), // This is because status gets chained hence we need mockReturnThis to literally return itself (this)
            json: vi.fn()
        };
        next = vi.fn();
    });

    describe("registerUser", () => {
        it("should pass an error if email or password is invalid", async () => {
            req.body = { email: "invalidemail", password: "short"};

            await registerUser(req as Request, res as Response, next);

            expect(next).toHaveBeenLastCalledWith(expect.any(ZodError)); // expect.any takes a constructor
        }); // Should be ideally done in separate middleware

        it("should pass an error if user already exists", async () => {
            req.body = { email: "existinguser@gmail.com", password: "password"};

            (userModel.fetchUsersByEmail as Mock).mockResolvedValue([{email: "existinguser@gmail.com", passwordHash: "password"}]);

            await registerUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(Error("User already exists"));
        });

        it("should return a token with status 201 if user registered successfully", async () => {
            req.body = { email: "newuser@gmail.com", password: "password"};

            (userModel.fetchUsersByEmail as Mock).mockResolvedValue([]);

            (userModel.createUser as Mock).mockResolvedValue([{id: "newUserId"}]);

            await registerUser(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "User registered",
                token_type: "Bearer",
                access_token: "SignedToken"
            });
        })
    });

    describe("loginUser", () => {
        it("should pass an error if email or password is invalid", async () => {
            req.body = { email: "invalidemail", password: 2};

            await loginUser(req as Request, res as Response, next);

            expect(next).toHaveBeenLastCalledWith(expect.any(ZodError)); // expect.any takes a constructor
        }); // Should be ideally done in separate middleware

        it("should pass an error if email is wrong", async () => {
            req.body = { email: "nonexistentuser@gmail.com", password: "password"};

            (userModel.fetchUsersByEmail as Mock).mockResolvedValue([]);

            await loginUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(Error("Invalid email"));
        });

        it("should pass an error if password is wrong", async () => {
            req.body = { email: "existinguser@gmail.com", password: "incorrectpassword"};

            (userModel.fetchUsersByEmail as Mock).mockResolvedValue([{email: "existinguser@gmail.com", passwordHash: "differentHashedPassword"}]);

            await loginUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(Error("Invalid password"));
        });

        it("should return a token with status 201 if user logs in successfully", async () => {
            req.body = { email: "existinguser@gmail.com", password: "password"};

            (userModel.fetchUsersByEmail as Mock).mockResolvedValue([{email: "existinguser@gmail.com", passwordHash: "hashedPassword"}]);

            await loginUser(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "User logged in",
                token_type: "Bearer",
                access_token: "SignedToken"
            });
        })
    });
});
