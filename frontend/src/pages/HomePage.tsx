import React from 'react'
import Landingimg from "../assets/landing.png"
import appDownloadImg from "../assets/appDownload.png"
import LoginFormModal from '@/forms/manage-user-form/LoginFormModal'
export default function HomePage() {
    return (
        <div className='flex flex-col gap-12'>
            <div className='bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16'>
                <h1 className='text-5xl font-bold tracking-tight text-orange-300'> FOLLOW UP</h1>
                <span className='text-xl'> Food in just a click of a button</span>
            </div>
            <LoginFormModal></LoginFormModal>

            <div className='grid md:grid-cols-2 gap-5'>
                <img src={Landingimg}></img>
                <div className='flex flex-col items-center justify-center gap-4 text-center'>
                    <span className='font-bold text-3xl tracking-tighter'> Order takeaway even faster!</span>
                    <span> Download Jo3et App for faster ordering and personalised recommandations</span>
                    <img src={appDownloadImg}></img>
                </div>
            </div>

        </div>
    )
}
