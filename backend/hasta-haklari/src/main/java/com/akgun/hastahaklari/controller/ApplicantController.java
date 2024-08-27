package com.akgun.hastahaklari.controller;

import com.akgun.hastahaklari.model.Applicant;
import com.akgun.hastahaklari.service.ApplicantService;
import com.akgun.hastahaklari.service.ReportService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.sf.jasperreports.engine.JRException;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.jfree.chart.servlet.ServletUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.module.FindException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("application")
public class ApplicantController {

    private ApplicantService applicationService;

    private ReportService reportService;

    @Autowired
    ApplicantController(ApplicantService applicationService, ReportService reportService){
        this.applicationService = applicationService;
        this.reportService = reportService;
    }

    @PostMapping("save")
    public Applicant saveApplication(@RequestBody Applicant application){
        return applicationService.saveApplication(application);
    }

    @GetMapping("applications")
    public List<Applicant> getApplications(){
        return applicationService.getApplications();
    }

    @PutMapping("update")
    public Applicant updateApplication(@RequestBody Applicant applicant){
        return applicationService.updateApplication(applicant);
    }

    @DeleteMapping("delete/{id}")
    public void deleteApplication(@PathVariable int id){
        applicationService.deleteApplication(id);
    }

    @GetMapping("findById/{id}")
    public Applicant findById(@PathVariable int id){
        return applicationService.findById(id);
    }


    @GetMapping("report")
    public String generateReport(HttpServletResponse response) throws JRException, IOException {
//        SXSSFWorkbook sxssfWorkbook = reportService.reportAsExcelFile();
//        FileOutputStream fileOutputStream = new FileOutputStream("C:\\Users\\hp\\Desktop\\Akgun\\copy\\backend\\Hasta-Haklari\\hasta-haklari\\src\\report\\applicants.xlsx");
//        sxssfWorkbook.write(fileOutputStream);

        SXSSFWorkbook sxssfWorkbook = reportService.reportAsExcelFile();
        response.setContentType("application/vnd.ms-excel");
        response.setHeader("Content-Disposition", "attachment; filename=\"applicants.xlsx\"");
        response.setStatus(200);

        ServletOutputStream servletOutputStream = response.getOutputStream();
        sxssfWorkbook.write(servletOutputStream);

        return reportService.exportReport();
    }
}
