import { useState } from "react";
import { read, utils } from "xlsx";
import { Header } from "./components/navigation/Header";
import { DragAndDrop } from "./components/drag&drop";
import { FileCard } from "./components/FilesCard";
import { Button } from "./components/ui/button";
import { useToast } from "./components/ui/use-toast";

function App() {
  const { toast } = useToast();
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [txtFile, setTxtFile] = useState<File | null>(null);
  const [excelColumnID, setExcelColumnID] = useState<string[]>([]);
  const [excelColumnDE, setExcelColumnDE] = useState<string[]>([]);
  const [excelColumnPARA, setExcelColumnPARA] = useState<string[]>([]);
  const [contentTxtFile, setContentTxtFile] = useState<string>();

  const convertAndDownload = () => {
    try {
      if (
        excelColumnDE.length > 0 &&
        excelColumnPARA.length > 0 &&
        contentTxtFile
      ) {
        const replaced = replaceWords(
          contentTxtFile,
          excelColumnID,
          excelColumnDE,
          excelColumnPARA
        );
        downloadTxtFile(replaced, "EDF_CHANGED.txt");
        // clear all states
        setExcelColumnDE([]);
        setExcelColumnPARA([]);
        setContentTxtFile("");
        setExcelFile(null);
        setTxtFile(null);

        toast({
          title: "Sucesso!",
          description: "Arquivos convertidos com sucesso."
        });
      }
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Ocorreu um erro ao tentar converter os arquivos.",
        variant: "destructive"
      });
    }
  };

  const downloadTxtFile = (content: string, fileName: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExcelFileUpload = (files: File[]) => {
    const file = files[0];
    const fileType = file.type;

    if (
      fileType === "application/vnd.ms-excel" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setExcelFile(file);
      readExcelFile(file);
    } else {
      toast({
        title: "Atenção!",
        description:
          "Tipo de arquivo inválido! Por favor, selecione um arquivo Excel (.xls, .xlsx).",
        variant: "destructive"
      });
    }
  };

  const handleTxtFileUpload = (files: File[]) => {
    const file = files[0];
    const fileType = file.type;

    if (fileType === "text/plain") {
      setTxtFile(file);
      readTxtFile(file);
    } else {
      toast({
        title: "Atenção!",
        description:
          "Tipo de arquivo inválido! Por favor, selecione um arquivo TXT.",
        variant: "destructive"
      });
    }
  };

  const replaceWords = (
    contentTxtFile: string,
    excelColumnID: string[],
    excelColumnDE: string[],
    excelColumnPARA: string[]
  ) => {
    // Divide o conteúdo do arquivo de texto em linhas
    const lines = contentTxtFile.split("\n");
    let modifiedContent = "";

    // Percorre cada linha do arquivo de texto
    for (let line of lines) {
      let modifiedLine = line;

      // Percorre os valores de ID, DE e PARA
      for (let i = 0; i < excelColumnID.length; i++) {
        const id = excelColumnID[i];
        const searchValue = excelColumnDE[i];
        const replaceValue = excelColumnPARA[i];

        // Verifica se a linha contém o ID
        if (line.includes(id)) {
          // Se o ID for encontrado na linha, faz a substituição de DE para PARA
          modifiedLine = modifiedLine.replaceAll(searchValue, replaceValue);
        }
      }

      // Adiciona a linha modificada ao conteúdo final
      modifiedContent += modifiedLine + "\n";
    }

    return modifiedContent;
  };

  const readExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(sheet, { header: 1 });

      const headerRow: any = jsonData[0];
      const columnIndex_ID = headerRow.findIndex(
        (header: any) => header === "ID"
      );
      const columnIndex_DE = headerRow.findIndex(
        (header: any) => header === "DE"
      );
      const columnIndex_PARA = headerRow.findIndex(
        (header: any) => header === "PARA"
      );

      if (columnIndex_ID !== -1) {
        const columnID = jsonData
          .slice(1)
          .map((row: any) => row[columnIndex_ID]);
        setExcelColumnID(columnID);
      }

      if (columnIndex_DE !== -1) {
        const columnDE = jsonData
          .slice(1)
          .map((row: any) => row[columnIndex_DE]);
        setExcelColumnDE(columnDE);
      }
      if (columnIndex_PARA !== -1) {
        const columnPARA = jsonData
          .slice(1)
          .map((row: any) => row[columnIndex_PARA]);
        setExcelColumnPARA(columnPARA);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const readTxtFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const contents = e.target.result as string;
      setContentTxtFile(contents);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Header />
      <div className="w-full h-full flex flex-col justify-center items-center px-4 pt-4">
        <div className="flex w-full md:justify-center space-y-7 md:items-start md:space-x-7 md:space-y-0 flex-col md:flex-row overflow-auto">
          <div className="flex flex-1 flex-col items-center md:items-end">
            <div className="flex flex-col items-center w-2/3">
              <p className="text-lg font-semibold">Selecione o arquivo Excel</p>
            </div>
            <DragAndDrop onUpload={handleExcelFileUpload} />
            {excelFile && (
              <FileCard
                fileName={excelFile.name}
                onDelete={() => setExcelFile(null)}
              />
            )}
          </div>

          <div className="flex flex-1 flex-col items-center md:items-start">
            <div className="flex flex-col items-center w-2/3">
              <p className="text-lg font-semibold">
                Selecione o arquivo de texto
              </p>
            </div>
            <DragAndDrop onUpload={handleTxtFileUpload} />
            {txtFile && (
              <FileCard
                fileName={txtFile.name}
                onDelete={() => setTxtFile(null)}
              />
            )}
          </div>
        </div>

        <Button
          className="mt-20"
          onClick={() => {
            if (!excelFile || !txtFile) {
              toast({
                title: "Atenção!",
                description: "Por favor, selecione os dois arquivos!",
                variant: "destructive"
              });
              return;
            }

            convertAndDownload();
          }}
        >
          Converter
        </Button>
      </div>
      <div className="shadow" />
    </>
  );
}

export default App;
