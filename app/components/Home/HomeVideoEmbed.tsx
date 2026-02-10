"use client";

type Props = {
  source: "youtube" | "instagram" | "facebook" | "generic";
  url: string;
};

const VideoEmbed = ({ source, url }: Props) => {
  if (source === "youtube") {
    const id = url.split("v=")[1]?.split("&")[0];
    return (
      <iframe
        className="w-full aspect-video rounded-lg"
        src={`https://www.youtube.com/embed/${id}`}
        allowFullScreen
      />
    );
  }

  if (source === "instagram") {
    return <iframe className="w-full h-125 rounded-lg" src={`${url}embed`} />;
  }

  if (source === "facebook") {
    return (
      <iframe
        className="w-full h-125 rounded-lg"
        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
          url,
        )}`}
      />
    );
  }

  return <video src={url} controls className="w-full rounded-lg" />;
};

export default VideoEmbed;
