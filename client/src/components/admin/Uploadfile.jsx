import React from 'react'

const Uploadfile = () => {

    const handleOnChange = (e) => {

        console.log(e.target.files)
    }

  return (
    <div>
        
        <input 
        onChange={handleOnChange}
            type='file'
            name='images'
            multiple
        />
    </div>
  )
}

export default Uploadfile
