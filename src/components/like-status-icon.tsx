import { DislikedIcon, DislikeIcon, LikedIcon, LikeIcon } from '@/assets/images/icons';
import { Video } from '@/models';

type LikeStatisIconProps = {
  video: Video
}

const LikeStatusIcon = ({ video }: LikeStatisIconProps) => {
  if(video.isLiked) {
    return (
      <>
      <div className="w-8 h-8 m-auto cursor-pointer text-green-500">
        <LikedIcon />
      </div>
      <div className="w-8 h-8 m-auto cursor-pointer text-gray-500">
        <DislikeIcon />
      </div>
      </>
    );
  } else if(video.isDisliked) {
    return (
      <>
        <div className="w-8 h-8 m-auto cursor-pointer text-red-500">
          <LikeIcon />
        </div>
        <div className="w-8 h-8 m-auto cursor-pointer text-gray-500">
          <DislikedIcon />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="w-8 h-8 m-auto cursor-pointer text-red-500">
          <LikeIcon />
        </div>
        <div className="w-8 h-8 m-auto cursor-pointer text-gray-500">
          <DislikeIcon />
        </div>
      </>
    );
  }
}

export default LikeStatusIcon;