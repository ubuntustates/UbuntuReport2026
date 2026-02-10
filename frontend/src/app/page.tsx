import EmergencyNews from "./_components/home/EmergencyNews";
import Main from "./_components/home/Main";


export default function Home() {
  return (
    <div className="h-full flex md:flex-row flex-col-reverse  ">
      <div className="md:block hidden">
        <EmergencyNews/>
      </div>
      <div className="flex-1">
        <Main/>
      </div>
    </div>
  );
}
