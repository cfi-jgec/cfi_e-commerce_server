"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            res.status(500).json({
                message: (err === null || err === void 0 ? void 0 : err.message) || "Internal server error",
                error: true,
                success: false
            });
        });
    };
};
exports.asyncHandler = asyncHandler;
