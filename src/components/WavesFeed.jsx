import { getFollowsStateless } from "deso-protocol";
import { useEffect, useState } from "react";

export const WavesFeed = () => {
  const [wavesFeed, setWavesFeed] = useState([]);
  
  /** useEffect(() => {
    const fetchWavesFeed = async () => {
      try {
        const result = await getFollowsStateless({
          PublicKeyBase58Check:
            "BC1YLfjx3jKZeoShqr2r3QttepoYmvJGEs7vbYx1WYoNmNW9FY5VUu6",
        });
        console.log("Waves:", result);
        setWavesFeed(result);
      } catch (error) {
        console.log("Something went wrong:", error);
      }
    };

    fetchWavesFeed();
  }, []);
**/
  return <div>waves</div>;
};
