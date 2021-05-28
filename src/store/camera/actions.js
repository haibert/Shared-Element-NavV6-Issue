export const TAKE_PICTURE = 'TAKE_PICTURE'
export const ADD_TO_GALLERY = 'ADD_TO_GALLERY'

export const takePicture = (uri) => {
    return {
        type: TAKE_PICTURE,
        pictureUri: uri,
    }
}

export const addToGallery = (photo, galleryID) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID
        const body = JSON.stringify({
            userID: userID,
            photo,
            galleryID,
        })
        console.log('🚀 ~ file: actions.js ~ line 19 ~ return ~ body', body)
        try {
            const response = await fetch(
                'http://164.90.246.1/api.php?key=!thisIsARandomString1981111212&file-upload=1',
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
                console.log(
                    '🚀 ~ file: actions.js ~ line 48 ~ return ~ data',
                    data
                )
            } catch (error) {
                throw error
            }

            dispatch({
                type: ADD_TO_GALLERY,
                picture: photo,
            })
        } catch (error) {
            throw error
        }
    }
}