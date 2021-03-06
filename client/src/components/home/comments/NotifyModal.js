import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Avatar from '../../Avatar'
import moment from 'moment'
const NotifyModal = () => {

    const { notify, auth } = useSelector(state => state)
    const dispatch = useDispatch()

    return (
        <div style={{ minWidth: '280px' }}>
            <div className='d-flex justify-content-between align-items-center px-3'>
                <h3>Notification</h3>
                {
                    notify.sound ? <i className='fas fa-bell text-danger'
                        style={{ fontSize: '1.2rem', cursor: 'pointer' }} />
                        : <i className='fas fa-bell-slash text-danger'
                            style={{ fontSize: '1.2rem', cursor: 'pointer' }} />
                }
            </div>
            <hr className='mt-0' />
            {
                notify.data.length === 0 &&
                <h3 className='mx-5'>No Notification</h3>
            }
            <div className='notifyheight'>
                {
                    notify.data.map((msg, index) => (
                        <div key={index} className='px-2 mb-3'>
                            <Link to={`${msg.url}`} className='d-flex text-dark align-items-center notifyhover'
                                style={{ textDecoration: 'none' }}
                            >
                                <Avatar src={msg.user.avatar} size='big-avatar' />
                                <div className='mx-1 flex-fill'>
                                    <div>
                                        <strong className='mr-1'>{msg.user.username}</strong>
                                        <span>{msg.text}</span>
                                    </div>
                                    {msg.content && <small>{msg.content.slice(0, 25)}...</small>}
                                </div>
                                <div style={{ width: '30px' }}>
                                    {msg.image && <Avatar src={msg.image} size='medium-avatar' />}
                                </div>
                            </Link>
                            <small className='text-muted d-flex justify-content-between px-2'>
                                {moment(msg.createdAt).fromNow()}
                                {
                                    !msg.isRead && <i className='fas fa-circle text-primary' />
                                }
                            </small>
                        </div>
                    ))
                }
            </div>

            <hr className='my-2' />

            <div className='text-right text-danger mr-2' style={{ cursor: 'pointer' }}>
                Delete All
            </div>
        </div>
    )
}

export default NotifyModal