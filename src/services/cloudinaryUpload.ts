export async function uploadToCloudinary(file: File): Promise<string> {
  const CLOUD_NAME = "dvq4f3k7q";
  const UPLOAD_PRESET = "skillvedika";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error:", data);
      throw new Error(data.error?.message || "Cloudinary upload failed");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}




