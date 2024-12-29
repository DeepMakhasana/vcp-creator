import { useParams } from "react-router-dom";

const Lesson = () => {
  const { lessonId } = useParams();
  return <div>Lesson = {lessonId}</div>;
};

export default Lesson;
