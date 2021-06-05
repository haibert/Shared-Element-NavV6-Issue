export const ADD_GALLERY = 'ADD_GALLERY'
export const SET_GALLERIES = 'SET_GALLERIES'
export const SET_PICS = 'SET_PICS'
export const DELETE_GALLERY = 'DELETE_GALLERY'

//models
import { Gallery, Pic } from '../../models/Models'

//navigation
// import { CommonActions } from '@react-navigation/native'

export const addGallery = (eventName, eventType, thumbnail, allowedUsers) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID
        try {
            const body = JSON.stringify({
                userID: userID,
                eventName,
                eventType,
                thumbnail,
                allowedUsers,
            })

            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&add-gallery=1',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        key: 'ThisIsASecretKey',
                    },
                    body: body,
                }
            )

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                const createdGalleryID = data.message.galleryID

                dispatch({
                    type: ADD_GALLERY,
                    newGalleryID: createdGalleryID,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const setGalleries = () => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID
        try {
            const body = JSON.stringify({
                userID: userID,
            })
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&get-user-galleries=1',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        key: 'ThisIsASecretKey',
                    },
                    body: body,
                }
            )

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                const galleries = data.message.galleries
                const loadedGalleries = []
                for (const key in galleries) {
                    loadedGalleries.push(
                        new Gallery(
                            galleries[key].galleryID,
                            galleries[key].eventName,
                            galleries[key].thumbnail,
                            galleries[key].eventDate
                        )
                    )
                }

                dispatch({
                    type: SET_GALLERIES,
                    galleries: loadedGalleries,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const setPics = (galleryID) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID
        try {
            const body = JSON.stringify({
                userID,
                galleryID,
            })
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&get-gallery-files=1',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        key: 'ThisIsASecretKey',
                    },
                    body: body,
                }
            )

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                const pics = data.message.images

                const loadedPics = []
                for (const key in pics) {
                    loadedPics.push(
                        new Pic(
                            pics[key].galleryID,
                            pics[key].fullPath,
                            pics[key].id
                        )
                    )
                }

                dispatch({
                    type: SET_PICS,
                    pics: loadedPics,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const deleteGallery = (galleryID) => {
    return async (dispatch, getState) => {
        try {
            const body = JSON.stringify({
                id: galleryID,
            })
            console.log('🚀 ~ file: action.js ~ line 169 ~ return ~ body', body)
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&delete-gallery=1',
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        key: 'ThisIsASecretKey',
                    },
                    body: body,
                }
            )

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await JSON.stringify(response)
                console.log(
                    '🚀 ~ file: action.js ~ line 189 ~ return ~ data',
                    data
                )
                // const data = await response.json()
                // const response = data.message.response
                // if (response === 'success') {
                //     dispatch({
                //         type: DELETE_GALLERY,
                //         deletedGallery: galleryID,
                //     })
                // } else {
                //     throw new Error('Something went wrong!')
                // }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const deletePhoto = (photoID) => {
    return async (dispatch, getState) => {
        try {
            const body = JSON.stringify({
                id: photoID,
            })
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&delete-image=1',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        key: 'ThisIsASecretKey',
                    },
                    body: body,
                }
            )

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await JSON.stringify(response)
                console.log(
                    '🚀 ~ file: action.js ~ line 189 ~ return ~ data',
                    data
                )

                // const data = await response.json()
                // const response = data.message.response
                // if (response === 'success') {
                //     dispatch({
                //         type: DELETE_GALLERY,
                //         deletedGallery: galleryID,
                //     })
                // } else {
                //     throw new Error('Something went wrong!')
                // }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}
