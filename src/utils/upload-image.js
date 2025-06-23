const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "Taskflow",
    });
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

const replaceImage = async (url, filePath) => {
  const publicId = getPublicIdFromUrl(url);
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId, // Same public_id as the image you want to replace
      overwrite: true,
    });
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    console.error("Error replacing image:", error);
    throw error;
  }
};

const deleteImage = async (url) => {
  const publicId = getPublicIdFromUrl(url);
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

function getPublicIdFromUrl(url) {
  // Use a regular expression to extract the public_id
  const regex = /\/v\d+\/(.+?)\.(jpg|jpeg|png|gif|webp)$/;
  const match = url.match(regex);

  if (match) {
    return match[1];
  } else {
    throw new Error("Invalid Cloudinary URL");
  }
}

module.exports = {
  uploadImage,
  replaceImage,
  deleteImage,
};
