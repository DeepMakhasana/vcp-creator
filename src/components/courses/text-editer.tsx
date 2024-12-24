import { Dispatch, SetStateAction } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface ITextEditorProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

const TextEditor = ({ value, setValue }: ITextEditorProps) => {
  const modules = {
    toolbar: [["bold", "italic"], [{ list: "bullet" }]],
  };

  const handleChange = (value: string) => {
    setValue(value);
  };
  return (
    <div className="w-full my-2">
      <ReactQuill value={value} onChange={handleChange} modules={modules} theme="snow" className="h-40 text-lg" />

      <div className="output mt-14 border p-3">
        <h2 className="mb-3">Output:</h2>
        <div dangerouslySetInnerHTML={{ __html: value }} className="text-sm text-muted-foreground" />
      </div>
    </div>
  );
};

export default TextEditor;
