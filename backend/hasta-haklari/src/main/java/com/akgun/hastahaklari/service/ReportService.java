package com.akgun.hastahaklari.service;

import com.akgun.hastahaklari.model.Applicant;
import com.akgun.hastahaklari.repository.ApplicantRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {
    ApplicantRepository applicantRepository;

    @Autowired
    ReportService(ApplicantRepository applicantRepository){
        this.applicantRepository = applicantRepository;
    }

    public String exportReport() throws FileNotFoundException, JRException {
        String path = "C:\\Users\\hp\\Desktop\\Akgun\\copy\\backend\\Hasta-Haklari\\hasta-haklari\\src\\report";

        List<Applicant> applicants = applicantRepository.findAll();

        for (int i = 0; i < applicants.size(); i++){
            String[] date =  applicants.get(i).getDate().split("[.]");
            applicants.get(i).setDate(date[2] + "." + date[1] + "." + date[0]);
        }

        File file = ResourceUtils.getFile("C:\\Users\\hp\\Desktop\\Akgun\\copy\\backend\\Hasta-Haklari\\hasta-haklari\\src\\main\\resources\\HastaHaklari.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());

        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(applicants);
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("createdBy", "akgun");
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

        JasperExportManager.exportReportToPdfFile(jasperPrint, path + "\\applicants.pdf");

        return "Report Generated in Path: " + path;
    }

    public SXSSFWorkbook reportAsExcelFile(){
        SXSSFWorkbook workbook = new SXSSFWorkbook(SXSSFWorkbook.DEFAULT_WINDOW_SIZE);
        Sheet sheet = workbook.createSheet();

        List<Applicant> applicants = applicantRepository.findAll();

        List<JSONObject> jsonObjects = new ArrayList<>();

        for(int i = 0; i < applicants.size(); i++){
            JSONObject jsonObject = new JSONObject();

            jsonObject.put("applicantId", applicants.get(i).getApplicantId());
            jsonObject.put("name", applicants.get(i).getName());
            jsonObject.put("surname", applicants.get(i).getSurname());
            jsonObject.put("suggestion", applicants.get(i).getSuggestion());
            jsonObject.put("type", applicants.get(i).getType());

            String[] dateList = applicants.get(i).getDate().split("[.]");
            String date = dateList[2] + "." + dateList[1] + "." + dateList[0];

            jsonObject.put("date", date);
            jsonObject.put("status", applicants.get(i).getStatus());

            if(applicants.get(i).getCommitteeDate() == null) {
                applicants.get(i).setCommitteeDate("");
            }
            jsonObject.put("committeeDate", applicants.get(i).getCommitteeDate());

            if(applicants.get(i).getResult() == null){
                applicants.get(i).setResult("");
            }
            jsonObject.put("result", applicants.get(i).getResult());

            jsonObjects.add(jsonObject);
        }

        Row row = sheet.createRow(0);
        String[] columns = {"applicantId", "name", "surname", "suggestion", "type", "date", "status", "committeeDate", "result"};

        for (int i = 0; i < columns.length; i++){
            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            style.setFont(font);

            style.setAlignment(HorizontalAlignment.CENTER);
            style.setVerticalAlignment(VerticalAlignment.CENTER);

            Cell cell = row.createCell(i);
            cell.setCellValue(columns[i]);

            cell.setCellStyle(style);
        }

        for(int i = 0; i < jsonObjects.size(); i++){
            row = sheet.createRow(i+1);

            for (int k = 0; k < columns.length; k++){
                //System.out.println(jsonObjects.get(i).get(columns[k]).toString());
                String colName = jsonObjects.get(i).get(columns[k]).toString();

                Cell cell = row.createCell(k);
                cell.setCellValue(colName);
            }
        }

        ((SXSSFSheet) sheet).trackAllColumnsForAutoSizing();

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

//        Row row = sheet.createRow(0);
//        Cell cell= row.createCell(0);
//        cell.setCellValue("aaaaaaaaaaaaa");

        return workbook;
    }
}
