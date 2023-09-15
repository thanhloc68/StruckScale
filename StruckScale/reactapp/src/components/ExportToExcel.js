/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export const ExportToExcel = ({ apiData, fileName }) => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const exportToCSV = (apiData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(apiData);
        /* custom headers */
        XLSX.utils.sheet_add_aoa(ws, [["Struck ID", "ordinalNumber", "Struck Number", "Document", "Product", "Customer",  "First Scale", "Second Scale", "Result", "First Scale Date", "Second Scale Date", "Create Date", "Style Scale", "Note"]], { origin: "A1" });
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };
    return (
        <button type="button" className="btn btn-success" onClick={(e) => exportToCSV(apiData, fileName)}> Export Report</button >
    );
};