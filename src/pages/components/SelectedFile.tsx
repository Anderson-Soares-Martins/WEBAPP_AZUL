interface SelectedFilePropsSchema {
  file: any;
  removeFile: () => void;
}

export function SelectedFile({ file, removeFile }: SelectedFilePropsSchema) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <p style={{ marginRight: '8px' }}>Arquivo selecionado: {file.name}</p>
      <button
        onClick={removeFile}
        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
      >
        &#x2716;
      </button>
    </div>
  );
}
