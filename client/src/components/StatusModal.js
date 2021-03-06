import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import { createPost, updatePost } from '../redux/actions/postAction'

const StatusModal = () => {

    const dispatch = useDispatch()
    const { auth, theme, status, socket } = useSelector(state => state)

    const [content, setContent] = useState('')
    const [images, setImages] = useState([])
    const [stream, setStream] = useState(false)
    const [tracks, setTracks] = useState('')

    const videoRef = useRef()
    const refCanvas = useRef()

    const handleChangeImages = (e) => {
        const files = [...e.target.files]

        let err = ''
        let newImages = []

        files.forEach(file => {
            if (!file) return err = 'Files does not exist'
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                return err = 'Image format is incorrect'
            }
            return newImages.push(file)
        })

        if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } })
        setImages([...images, ...newImages])
    }

    const deleteImages = (index) => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    useEffect(() => {
        if (status.onEdit) {
            setContent(status.content)
            setImages(status.images)
        }
    }, [status])


    // Sử dụng Camera thiết bị

    const handleStream = (e) => {
        e.preventDefault()
        setStream(true)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(mediaStream => {
                    videoRef.current.srcObject = mediaStream
                    videoRef.current.play()
                    const track = mediaStream.getTracks()
                    setTracks(track[0])
                })
                .catch(err => console.log(err))
        }
    }

    // Chup Anh
    const handleCapture = (e) => {
        e.preventDefault()
        const width = videoRef.current.clientWidth
        const height = videoRef.current.clientHeight
        refCanvas.current.setAttribute('width', width)
        refCanvas.current.setAttribute('height', height)
        const ctx = refCanvas.current.getContext('2d')
        ctx.drawImage(videoRef.current, 0, 0, width, height)
        let URL = refCanvas.current.toDataURL()
        setImages([...images, { camera: URL }])
    }

    const handleStopStream = () => {
        tracks.stop()
        setStream(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (images.length === 0) {
            return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: 'Plz add your photo' } })
        }

        if (status.onEdit) {
            dispatch(updatePost({ content, images, auth, status }))

        } else {
            dispatch(createPost({ content, images, auth, socket }))
        }

        setContent('')
        setImages([])
        if (tracks) tracks.stop()
        dispatch({ type: GLOBALTYPES.STATUS, payload: false })
    }

    return (
        <div className='status_modal'>
            <form onSubmit={handleSubmit}>

                <div className='status_header'>
                    {
                        status.onEdit ?
                            <h5 className='m-0'>Update Post</h5> :
                            <h5 className='m-0'>Create Post</h5>
                    }
                    <span onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: false })}>&times;</span>
                </div>

                <div className='status_body'>
                    <textarea name='content' placeholder={`${auth.user.username}, What are you thinking ? `}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />

                    <div className='show_images'>
                        {
                            images.map((img, index) => (
                                <div key={index} id='file_img'>
                                    <img
                                        src={img.camera ?
                                            img.camera :
                                            img.url ? img.url : URL.createObjectURL(img)}
                                        alt='images'
                                        style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
                                        className='img-thumbnail'
                                    />
                                    <span onClick={() => deleteImages(index)}>&times;</span>
                                </div>
                            ))
                        }
                    </div>

                    {
                        stream &&
                        <div className='stream position-relative'>
                            <video src='' autoPlay muted ref={videoRef} width='100%' height='100%'
                                style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
                            />
                            <span onClick={handleStopStream}>
                                &times;
                            </span>

                            <canvas ref={refCanvas} style={{ display: 'none' }} />
                        </div>
                    }

                    <div className='input_images'>

                        {
                            stream
                                ?
                                <button style={{ marginBottom: '10px', padding: '5px' }}
                                    onClick={handleCapture}
                                >
                                    Camera
                                </button>
                                :
                                <>
                                    <button style={{ marginBottom: '10px', padding: '5px' }}
                                        onClick={handleStream}
                                    >Video</button>

                                    <div className='file_upload'>
                                        <input type='file' name='file' id='file'
                                            multiple accept='image/*'
                                            onChange={handleChangeImages}
                                        />
                                    </div>
                                </>
                        }


                    </div>
                </div>

                <div className='status_footer my-3'>

                    {
                        status.onEdit ?
                            <button className='btn btn-dark w-100' type='submit'>
                                Update
                            </button> :
                            <button className='btn btn-dark w-100' type='submit'>
                                Post
                            </button>
                    }

                </div>
            </form>
        </div>
    )
}

export default StatusModal