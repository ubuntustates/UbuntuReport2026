import Image from "next/image"
import notificationBell from '@/images/notificationBell.png'
import global from '@/images/global.png'
import verify from '@/images/verify.png'
import { CategorySelectAbout } from "../_components/home/CategorySelectAbout"
import logo from '@/images/logo.png'
import twitter from '@/images/twitter.png'
import facebook from '@/images/facebook.png'
import instagram from '@/images/instagram.png'

export default function About(){
    return(
        <main className="flex flex-col justify-center items-center">
            <section className="md:w-[70%] px-[20px]">
                <article className="py-[53px] flex flex-col gap-[35px] ">
                    <h3 className="text-center font-semibold text-[28px]">About Us</h3>
                    <p className="text-center">Our mission is to provide timely and accurate emergency news from around the globe, 
                        ensuring that individuals and communities are informed and prepared. We strive to be the 
                        leading source for real-time alerts and verified reports, 
                        empowering people to respond effectively in critical situations.</p>
                </article>

                <article className="pb-[53px] flex md:flex-row flex-col gap-y-6 justify-between">
                    <div className="w-full md:w-[290px] h-[136px] p-[14px] border border-solid border-[#E8CFCF] rounded-[8px] shadow shadow-[#E8CFCF]">
                        <Image src={notificationBell} alt="notificationBell" className="w-[20px] h-auto mb-[12px]"/>
                        <h4 className="font-semibold text-[20px]">Real-Time Alerts</h4>
                        <p className="text-[#994D4D]">Instant notifications for breaking emergencies.</p>
                    </div>

                    <div className="w-full md:w-[290px] h-[136px] p-[14px] border border-solid border-[#E8CFCF] rounded-[8px] shadow shadow-[#E8CFCF]">
                        <Image src={global} alt="global" className="w-[20px] h-auto mb-[12px]"/>
                        <h4 className="font-semibold text-[20px]">Global Coverage</h4>
                        <p className="text-[#994D4D]">Comprehensive news from every corner of the world.</p>
                    </div>

                    <div className="w-full md:w-[290px] h-[136px] p-[14px] border border-solid border-[#E8CFCF] rounded-[8px] shadow shadow-[#E8CFCF]">
                        <Image src={verify} alt="verify" className="w-[20px] h-auto mb-[12px]"/>
                        <h4 className="font-semibold text-[20px]">Verified Reports</h4>
                        <p className="text-[#994D4D]">Reliable information from trusted sources.</p>
                    </div>
                </article>


                <article className="py-[53px] flex flex-col gap-[35px] ">
                    <h3 className="text-center font-semibold text-[28px]">Contact Us</h3>
                    
                    <div className="flex md:flex-row flex-col gap-y-7 justify-between">
                        <div className="flex flex-col gap-[4px] text-[14px] w-full md:w-[301px]">
                            <label htmlFor="" className="font-semibold">Name</label>
                            <input type="text" 
                                className="w-full h-[46px] p-[12px] bg-[#FFFFFF] border border-[#E8CFCF] 
                                border-solid text-[#994D4D] rounded-[8px]"
                                placeholder="Your  Name"
                            />
                        </div>


                        <div className="flex flex-col gap-[4px] text-[14px] w-full md:w-[301px]">
                            <label htmlFor="" className="font-semibold">Email</label>
                            <input type="text" 
                                className="w-full h-[46px] p-[12px] bg-[#FFFFFF] border border-[#E8CFCF] 
                                border-solid text-[#994D4D] rounded-[8px]"
                                placeholder="Your  Email"
                            />
                        </div>

                        <div className="flex flex-col gap-[4px] text-[14px] w-full md:w-[301px]">
                            <label htmlFor="" className="font-semibold">Category</label>
                            <CategorySelectAbout />
                        </div>
                    </div>

                    <div>
                        <div className="flex flex-col gap-[4px] text-[14px]">
                            <label htmlFor="" className="font-medium">Message</label>
                            <textarea  
                                className=" h-[152px] p-[12px] bg-[#FFFFFF] border border-[#E8CFCF] 
                                border-solid text-[#994D4D] rounded-[8px]"
                            />
                        </div>
                        <button className="px-[16px] py-[10px] mt-[18px] bg-[#ED2B2B] text-[#FCF7F7] rounded-[8px] text-[14px] font-semibold w-fit">Submit</button>
                    </div>
                </article>
            </section>


            <footer className="bg-white md:h-[280px] w-full mt-[80px] py-9 flex px-[20px] md:justify-center md:items-center">
                <article className="md:w-[50%] flex flex-col items-center ">
                    <div className="flex gap-2 items-center self-start">
                        <Image src={logo} alt="logo" className="w-[19.25px] h-[19.68px]"/>
                        <p className="font-semibold text-[16px]">Global Emergency News</p>
                    </div>

                    <div className="mt-[60px] flex md:flex-row flex-col gap-y-7 justify-between w-full">
                        <div className="flex flex-col gap-[4px]">
                            <h5 className="font-semibold text-[18px]">Direct Contact</h5>
                            <p>Email: contact@globalnews.com</p>
                            <p>Phone: +1-555-123-4567</p>
                        </div>

                        <div className="flex flex-col gap-[4px]">
                            <h5 className="font-semibold text-[18px]">Follow Us</h5>
                            <div className="flex gap-[6px]">
                                <button className="bg-[#FCF7F7] flex flex-col gap-[6px] items-center w-[70px] py-[10px]">
                                    <div className="p-[10px] rounded-full bg-[#F2E8E8] w-[40px]">
                                        <Image src={twitter} alt="twitter" className="w-full h-auto "/>
                                    </div>
                                    <p className="text-[14px] font-medium">Twitter</p>
                                </button>

                                <button className="bg-[#FCF7F7] flex flex-col gap-[6px] items-center w-[70px] py-[10px]">
                                    <div className="p-[10px] rounded-full bg-[#F2E8E8] w-[40px]">
                                        <Image src={facebook} alt="facebook" className="w-full h-auto "/>
                                    </div>
                                    <p className="text-[14px] font-medium">Facebook</p>
                                </button>

                                <button className="bg-[#FCF7F7] flex flex-col gap-[6px] items-center w-[70px] py-[10px]">
                                    <div className="p-[10px] rounded-full bg-[#F2E8E8] w-[40px]">
                                        <Image src={instagram} alt="instagram" className="w-full h-auto "/>
                                    </div>
                                    <p className="text-[14px] font-medium">Instagram</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </footer>
        </main>
    )
} 