package com.akgun.hastahaklari.service;

import com.akgun.hastahaklari.model.Applicant;
import com.akgun.hastahaklari.repository.ApplicantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ApplicantService {
    private ApplicantRepository applicationRepository;
    @Autowired
    ApplicantService(ApplicantRepository applicationRepository){
        this.applicationRepository = applicationRepository;
    }

    public Applicant saveApplication(Applicant application){
        return applicationRepository.save(application);
    }
    public List<Applicant> getApplications(){
        return applicationRepository.findAll();
    }
    public Applicant updateApplication(Applicant applicant){
        return applicationRepository.save(applicant);
    }

    public void deleteApplication(int id){
        applicationRepository.deleteById(id);
    }
    public Applicant findById(int id){
        System.out.println(applicationRepository.findById(id).orElse(null).getApplicantId());
        return applicationRepository.findById(id).orElse(null);
    }
}
