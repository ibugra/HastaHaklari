package com.akgun.hastahaklari.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "applicants")
public class Applicant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Applicant ID", nullable = false, updatable = false)
    private int applicantId;
    @Column(name = "Name")
    private String name;
    @Column(name = "Surname")
    private String surname;
    @Column(name = "Suggestion", length = 1024)
    private String suggestion;
    @Column(name = "Type")
    private String type;
    @Column(name = "Date")
    private String date;
    @Column(name = "Status")
    private String status;
    @Column(name = "Committee Date")
    private String committeeDate;
    @Column(name = "Result")
    private String result;
}