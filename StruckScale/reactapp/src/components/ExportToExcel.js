/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react'
import * as ExcelJS from 'exceljs';
export const ExportToExcel = ({ typeReport, apiData, fileName }) => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const exportToCSV = async (apiData, fileName) => {
        // Dòng bắt đầu từ số 3 (index 2)
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');
        // Add custom headers based on typeReport
        worksheet.getCell("A1").value = "CÔNG TY CỔ PHẦN TICO";
        if (typeReport === 'Cân xe') {
            worksheet.getCell("A2").value = "BÁO CÁO KẾT QUẢ CÔNG VIỆC CÂN XE";
            worksheet.addRow([
                'Struck ID', 'Ordinal Number', 'Struck Number', 'Document', 'Product', 'Customer', 'First Scale', 'Second Scale', 'Result',
                'First Scale Date', 'Second Scale Date', 'Create Date', 'Style Scale', 'Note', 'Is Done'
            ]);
        } else if (typeReport === 'Bơm xe bồn') {
            worksheet.getCell("A2").value = "BÁO CÁO KẾT QUẢ CÔNG VIỆC BƠM XE BỒN";
            worksheet.addRow([
                'Struck ID', 'Ordinal Number', 'Struck Number', 'Document', 'Product', 'Customer', 'Source Of Goods', 'Requested Volume', 'Pump Volume',
                'Time Pump Start', 'Time Pump End', 'Processing', 'Notes', 'Create Date'
            ]);
        }
        worksheet.mergeCells('A1:O1')
        worksheet.mergeCells('A2:O2')
        // Add data rows
        apiData.forEach(data => {
            worksheet.addRow(Object.values(data));
        });
        //Auto filter
        worksheet.autoFilter = 'A3:O3';
        // Automatically adjust column widths to fit content
        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                if (rowNumber >= 3) {
                    const columnLength = cell.value ? cell.value.toString().length : 0;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                }
            });
            column.width = maxLength < 15 ? 15 : maxLength; // Minimum column width is set to 10
        });
        // Apply borders to all cells in the worksheet
        worksheet.eachRow(row => {
            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
                cell.alignment = { horizontal: 'center', vertical: 'center' }
                cell.font = { name: 'Time New Roman' }
            });
        });
        const buffer = await workbook.xlsx.writeBuffer();
        const data = new Blob([buffer], { type: fileType });
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName + fileExtension;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };
    return (
        <button type="button" className="btn btn-success" onClick={() => exportToCSV(apiData, fileName)}> Export Report</button >
    );
};