import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Resize from 'react-image-file-resizer';
import { removeFile, uploadFiles } from '../../api/product';
import useSabnuaStore from '../../store/SabnuaStore';

const Uploadfile = ({ form, setForm }) => {
    const token = useSabnuaStore((state) => state.token);
    const [loading, setLoading] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);

    // แสดงตัวอย่างรูปภาพก่อนอัปโหลด
    const handleFilePreview = (files) => {
        const previews = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        );
        setPreviewImages(previews);
    };

    const handleOnChange = (e) => {
        const files = e.target.files;
        if (files) {
            setLoading(true);
            handleFilePreview(files); // แสดงตัวอย่างไฟล์
            let allFiles = [...form.images];

            const processFiles = async () => {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    // ตรวจสอบประเภทไฟล์
                    if (!file.type.startsWith('image/')) {
                        Swal.fire({
                            title: 'ผิดพลาด!',
                            text: `File "${file.name}" ไม่ใช่รูปภาพ!`,
                            icon: 'error',
                            confirmButtonText: 'ตกลง',
                        });
                        continue;
                    }

                    // ตรวจสอบขนาดไฟล์
                    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
                    if (file.size > MAX_FILE_SIZE) {
                        Swal.fire({
                            title: 'ผิดพลาด!',
                            text: `File "${file.name}" มีขนาดใหญ่เกินไป (สูงสุด 5MB)`,
                            icon: 'error',
                            confirmButtonText: 'ตกลง',
                        });
                        continue;
                    }

                    // Resize และอัปโหลดไฟล์
                    Resize.imageFileResizer(
                        file,
                        360, // ความกว้าง
                        360, // ความสูง
                        'JPG',
                        75, // คุณภาพ
                        0, // หมุน
                        async (data) => {
                            try {
                                const res = await uploadFiles(token, data); // อัปโหลด
                                const newImage = {
                                    url: res.data.url,
                                    public_id: res.data.public_id,
                                };
                                allFiles.push(newImage);
                                setForm({
                                    ...form,
                                    images: allFiles,
                                });
                                Swal.fire({
                                    title: 'สำเร็จ!',
                                    text: `อัปโหลดรูป "${file.name}" สำเร็จ!`,
                                    icon: 'success',
                                    confirmButtonText: 'ตกลง',
                                });
                            } catch (err) {
                                Swal.fire({
                                    title: 'ผิดพลาด!',
                                    text: `ไม่สามารถอัปโหลดรูป "${file.name}" ได้`,
                                    icon: 'error',
                                    confirmButtonText: 'ตกลง',
                                });
                                console.error(err);
                            }
                        },
                        'base64' // Output เป็น base64
                    );
                }
            };

            processFiles().finally(() => setLoading(false)); // จบการทำงาน
        }
    };

    const handleDelete = async (public_id) => {
        if (!public_id) {
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'ไม่สามารถลบรูปได้ เนื่องจาก ID ของรูปหายไป',
                icon: 'error',
                confirmButtonText: 'ตกลง',
            });
            return;
        }

        try {
            const res = await removeFile(token, public_id); // ลบรูป
            console.log("File deleted successfully:", res.data);

            // อัปเดต state
            setForm({
                ...form,
                images: form.images.filter((image) => image.public_id !== public_id),
            });

            Swal.fire({
                title: 'สำเร็จ!',
                text: `ลบรูปสำเร็จ!`,
                icon: 'success',
                confirmButtonText: 'ตกลง',
            });
        } catch (err) {
            console.error("Error deleting file:", err.response?.data || err.message);
            Swal.fire({
                title: 'ผิดพลาด!',
                text: `ไม่สามารถลบรูปได้`,
                icon: 'error',
                confirmButtonText: 'ตกลง',
            });
        }
    };

    return (
        <div className='m-4'>
            <div className="image-gallery flex mx-auto gap-2 my-4">
                {/* แสดงภาพ */}
                {form.images.map((image, index) => (
                    <div key={index} className="image-item relative">
                        <img
                            className="uploaded-image w-20 h-20 hover:scale-125"
                            src={image.url}
                            alt={`uploaded-${index}`}
                        />
                        <span
                            onClick={() => handleDelete(image.public_id)}
                            className='absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-md cursor-pointer'>
                            x
                        </span>
                    </div>
                ))}
            </div>

            <div className="preview-section">
                {/* แสดงตัวอย่างไฟล์ก่อนอัปโหลด */}
                {previewImages.length > 0 && (
                    <div className="flex gap-2">
                        {previewImages.map((url, index) => (
                            <img
                                key={index}
                                className="preview-image w-16 h-16 border"
                                src={url}
                                alt={`preview-${index}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="upload-section">
                <input
                    onChange={handleOnChange}
                    type="file"
                    name="images"
                    multiple
                    disabled={loading}
                />
                {loading && <p>กำลังอัปโหลดไฟล์...</p>}
            </div>
        </div>
    );
};

export default Uploadfile;
