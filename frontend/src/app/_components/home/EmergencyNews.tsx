// src\app\_components\home\EmergencyNews.tsx
'use client'
import { CategorySelect } from "./CategorySelect"
import { LocationSelect } from "./LocationSelect"

export default function EmergencyNews(){
    return(
        <aside className="md:w-fit w-full h-full md:pl-[59px] md:pr-[42px] px-[20px] border-t md:border-r border-solid border-[#D9D9D9]  py-[53px] ">
            <p className="md:text-[28px] text-[20px] font-semibold">Post Emergency News</p>

            <form action="" method="post" 
                    className="flex flex-col gap-[18px] text-[16px] mt-[18px]"
                    onSubmit={(e)=>{e.preventDefault()}}
                >

                <div className="flex flex-col gap-[4px]">
                    <label htmlFor="" className="font-medium">Title</label>
                    <input type="text" 
                        className="w-full md:w-[333px] h-[46px] p-[12px] bg-[#FFFFFF] border border-[#E8CFCF] 
                        border-solid text-[#994D4D] rounded-[8px]"
                        placeholder="Enter  title"
                    />
                </div>

                <div className="flex flex-col gap-[4px]">
                    <label htmlFor="" className="font-medium">Body</label>
                    <textarea  
                        className="w-full md:w-[333px] h-[120px] p-[12px] bg-[#FFFFFF] border border-[#E8CFCF] 
                        border-solid text-[#994D4D] rounded-[8px]"
                    />
                </div>

                <div className="flex flex-col gap-[4px]">
                    <label htmlFor="" className="font-medium">Category/Tags</label>
                    <CategorySelect />
                </div>

                <div className="flex flex-col gap-[4px]">
                    <label htmlFor="" className="font-medium">Location</label>
                    <LocationSelect/>
                </div>

                <button className="px-[16px] py-[10px] bg-[#F2E8E8] rounded-[8px] text-[14px] font-semibold w-fit">Upload Image</button>

                <button className="px-[16px] py-[10px] bg-[#F2E8E8] rounded-[8px] text-[14px] font-semibold w-fit">Record/Upload Audio</button>

                <button className="px-[16px] py-[10px] bg-[#ED2B2B] text-[#FCF7F7] rounded-[8px] text-[14px] font-semibold w-fit">Submit</button>

                 
            </form>
        </aside>
    )
}