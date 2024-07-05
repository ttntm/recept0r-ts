/**
 * Checks a path for starting with 'https' and returns 'true' if that's the case
 */
export function isImgUploaded(path: string) {
  const checkImgSrc = RegExp(/^https:\/\//)
  return checkImgSrc.test(path)
}

/**
 * Uploads an image to Cloudinary
 * @param url Target URL for image upload
 * @param data FormData representation of the image coming from file reader
 */
export async function uploadImage(url: string, data: FormData) {
  const error = {
    message: 'Error uploading image.',
    data: null
  }

  try {
    const req = await fetch(url, {
      body: data,
      method: 'POST'
    })

    const res = await req.json()

    return res
      ? {
        message: 'Image successfully uploaded.',
        data: res.secure_url
      }
      : error
  } catch (err) {
    return error
  }
}
