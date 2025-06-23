const fs = require("fs");
const { errorResponse } = require("@/utils/response-helpers");

const fileUploadValidation = (req, res, next) => {
  if (!req.file) {
    return errorResponse(res, "The image or file is required.", 400);
  }

  next();
};

// Allowed image MIME types
const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const fileTypeValidation = (req, res, next) => {
  let invalid = false;

  if (req.file && !allowedMimeTypes.includes(req.file.mimetype)) {
    invalid = true;
  } else if (req.files) {
    for (const fieldName in req.files) {
      const files = req.files[fieldName];
      const fileArray = Array.isArray(files) ? files : [files];

      for (const file of fileArray) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          invalid = true;
          break;
        }
      }
    }
  }

  if (invalid) {
    // delete all uploaded files
    if (req.file) {
      fs.unlinkSync(req.file.path);
    } else if (req.files) {
      for (const fieldName in req.files) {
        const files = req.files[fieldName];
        const fileArray = Array.isArray(files) ? files : [files];
        for (const file of fileArray) {
          fs.unlinkSync(file.path);
        }
      }
    }
    return errorResponse(
      res,
      "Only images (JPEG, PNG, JPG, WEBP) are allowed.",
      400
    );
  }

  next();
};

module.exports = {
  fileUploadValidation,
  fileTypeValidation,
};
