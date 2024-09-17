import { SelectedFile } from './SelectedFile';

interface SelectedFileProps {
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  file: any;
  removeFile: () => void;
  title: string;
  label: string;
}

export function FileDropArea({
  handleDrop,
  file,
  removeFile,
  title,
  label,
}: SelectedFileProps) {
  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        width: '300px',
        height: '200px',
        border: '2px solid #ccc',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <h3>{title}</h3>
      <p>{label}</p>
      {file ? (
        <SelectedFile file={file} removeFile={removeFile} />
      ) : (
        <div>
          <p style={{ color: '#666' }}>Solte o arquivo aqui</p>
        </div>
      )}
    </div>
  );
}
