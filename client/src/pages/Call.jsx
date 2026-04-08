import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function Call() {
  const { roomId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const appID = 179043932; // 🔁 replace
    const serverSecret = "566ecd80428fd968a4618c9a657de73e"; // 🔁 replace

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      user.id,
      user.name
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: document.getElementById("video-call"),
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
    });
  }, []);

  return (
  <div className="w-screen h-screen bg-black pt-6 flex justify-center">
    
    {/* 👇 VIDEO CONTAINER */}
    <div className="w-full max-w-5xl h-[80vh] rounded-lg overflow-hidden shadow-xl">
      <div id="video-call" className="w-full h-full"></div>
    </div>

  </div>
);
}

export default Call;
