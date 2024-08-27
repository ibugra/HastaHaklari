package com.akgun.hastahaklari.repository;

import com.akgun.hastahaklari.model.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicantRepository extends JpaRepository<Applicant, Integer> {
}
