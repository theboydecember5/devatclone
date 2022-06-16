export const checkImage = (file) => {
    let err = ''

    if (!file) return err = 'File does not exist'

    if (file.size > 1024 * 1024)
        err = 'The largest image size is 1 MB'

    if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        err = 'Image format is incorrect'

    return err
}

export const imageUpload = async (images) => {
    let imgArr = []
    for (const item of images) {

        const formData = new FormData()
        // Nếu có ảnh từ Camera thì dùng if else không thì chỉ cần dùng dòng 24
        if (item.camera) {
            formData.append('file', item.camera)
        } else {
            formData.append('file', item)
        }
        formData.append('upload_preset', 'ka95etyj')
        formData.append('cloud_name', 'dmx182kqu')
        const res = await fetch("https://api.cloudinary.com/v1_1/dmx182kqu/image/upload", {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        imgArr.push({ public_id: data.public_id, url: data.secure_url })
    }
    return imgArr
}