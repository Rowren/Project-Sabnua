import React from 'react';
import FormEditUser from '../../components/card/FormEditUser';
import { useParams } from 'react-router-dom';

const EditProfile = () => {
  const { id } = useParams();  // ดึง id จาก URL params
  return (
    <div>
      <FormEditUser id={id} />  {/* ส่งค่า id ไปยัง FormEditUser */}
    </div>
  );
}

export default EditProfile;
