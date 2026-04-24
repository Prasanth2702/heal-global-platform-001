import React, { useState, useMemo, useEffect } from 'react';
import { User, Search, ChevronDown, X, ChevronRight, BookOpen, ArrowUp } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/pages/alldetails/Header';
import Footer from '@/pages/alldetails/Footer';
import { useNavigate, useParams } from 'react-router';
import logoMedicalLibrary from '../../image/imageletter.png';

// Full condition data extracted from the provided HTML
// Organized by first letter for quick access
const conditionsData: Record<string, { name: string; url: string }[]> = {
  a: [
    { name: "AL Amyloidosis", url: "/conditions/al-amyloidosis/" },
    { name: "Abdominal Pain", url: "/conditions/abdominal-pain/" },
    { name: "Achilles Tendonitis", url: "/conditions/achilles-tendonitis/" },
    { name: "Acne Vulgaris", url: "/conditions/acne-vulgaris/" },
    { name: "Acute Appendicitis", url: "/conditions/acute-appendicitis/" },
    { name: "Acute Aspiration of Oropharyngeal or Gastric Contents", url: "/conditions/acute-aspiration-of-e-or-gastric-contents/" },
    { name: "Acute Bronchitis", url: "/conditions/acute-bronchitis/" },
    { name: "Acute Gastritis", url: "/conditions/acute-gastritis/" },
    { name: "Acute HIV Infection", url: "/conditions/acute-hiv-infection/" },
    { name: "Acute Heart Failure", url: "/conditions/acute-heart-failure/" },
    { name: "Acute Laryngitis", url: "/conditions/acute-laryngitis/" },
    { name: "Acute Otitis Media", url: "/conditions/acute-otitis-media/" },
    { name: "Acute Pancreatitis", url: "/conditions/acute-pancreatitis/" },
    { name: "Acute Panic Attack", url: "/conditions/acute-panic-attack/" },
    { name: "Acute Pharyngitis", url: "/conditions/acute-pharyngitis/" },
    { name: "Acute Pyelonephritis", url: "/conditions/acute-pyelonephritis/" },
    { name: "Acute Stress Disorder", url: "/conditions/acute-stress-disorder/" },
    { name: "Acute Varicella Zoster (Chickenpox)", url: "/conditions/acute-varicella-zoster/" },
    { name: "Adjustment Disorder", url: "/conditions/adjustment-disorder/" },
    { name: "Adult-onset Still's Disease (AOSD)", url: "/conditions/adult-onset-stills-disease/" },
    { name: "Alcohol Intoxication", url: "/conditions/alcohol-intoxication/" },
    { name: "Alcohol Withdrawal", url: "/conditions/alcohol-withdrawal/" },
    { name: "Allergic Conjunctivitis", url: "/conditions/allergic-conjunctivitis/" },
    { name: "Allergic Rhinitis", url: "/conditions/allergic-rhinitis/" },
    { name: "Alzheimer’s Disease", url: "/conditions/alzheimers-disease/" },
    { name: "Amyotrophic Lateral Sclerosis (ALS)", url: "/conditions/amyotrophic-lateral-sclerosis/" },
    { name: "Anal Cancer", url: "/conditions/anal-cancer/" },
    { name: "Anal Fissure", url: "/conditions/anal-fissure/" },
    { name: "Anaphylaxis", url: "/conditions/anaphylaxis/" },
    { name: "Anemia", url: "/conditions/anemia/" },
    { name: "Antiviral for COVID-19: all you need to know", url: "/conditions/antiviral-medication/" },
    // { name: "Antiviral for COVID-19: all you need to know", url: "/covid/antiviral-medication/" },
    { name: "Aortic Dissection", url: "/conditions/aortic-dissection/" },
    { name: "Aphthous Mouth Ulcers", url: "/conditions/aphthous-ulcers/" },
    { name: "Appendix pain", url: "/conditions/appendix-pain/" },
    { name: "Arthritis", url: "/conditions/arthritis/" },
    { name: "Asperger Syndrome", url: "/conditions/asperger-syndrome/" },
      { name: "Asthma", url: "/conditions/asthma/" },
      { name: "Asymptomatic COVID-19", url: "/conditions/asymptomatic-covid-19/" },
      { name: "At-home Testosterone Test", url: "/conditions/at-home-testosterone-test/" },
      // { name: "Asymptomatic COVID-19", url: "/covid/asymptomatic-covid-19/" },
      // { name: "At-home Testosterone Test", url: "/hormones/at-home-testosterone-test/" },
    { name: "Ataxia", url: "/conditions/ataxia/" },
    { name: "Atherosclerosis", url: "/conditions/atherosclerosis/" },
    { name: "Atopic Dermatitis", url: "/conditions/atopic-dermatitis/" },
    { name: "Atrial fibrillation (AFib)", url: "/conditions/atrial-fibrillation-afib/" },
    { name: "Attention Deficit Hyperactivity Disorder (ADHD)", url: "/conditions/attention-deficit-hyperactivity-disorder/" },
    { name: "Autism", url: "/conditions/autism/" },
    { name: "Avian influenza (bird flu)", url: "/conditions/avian-influenza-virus/" },
  ],
//   b: [
//     { name: "Baby Eczema", url: "/conditions/baby-eczema/" },
//     { name: "Bacterial Conjunctivitis", url: "/conditions/bacterial-conjunctivitis/" },
//     { name: "Bacterial Gastroenteritis", url: "/conditions/bacterial-gastroenteritis/" },
//     { name: "Bacterial Meningitis", url: "/conditions/bacterial-meningitis/" },
//     { name: "Bacterial Prostatitis", url: "/conditions/bacterial-prostatitis/" },
//     { name: "Bacterial Sinusitis", url: "/conditions/bacterial-sinusitis/" },
//     { name: "Bacterial Vaginosis", url: "/conditions/bacterial-vaginosis/" },
//     { name: "Benign Mole", url: "/conditions/benign-mole/" },
//     { name: "Benign Paroxysmal Positional Vertigo", url: "/conditions/benign-paroxysmal-positional-vertigo/" },
//     { name: "Benign Prostatic Hyperplasia", url: "/conditions/benign-prostatic-hyperplasia/" },
//     { name: "Bilirubin", url: "/biomarkers/bilirubin/" },
//     { name: "Biomarkers Guide", url: "/biomarkers/" },
//     { name: "Bipolar Disorder", url: "/conditions/bipolar-affective-disorder/" },
//     { name: "Bladder Cancer", url: "/conditions/bladder-cancer/" },
//     { name: "Blood Work Results", url: "/blood-test-results/" },
//     { name: "Borderline Personality Disorder", url: "/conditions/borderline-personality-disorder/" },
//     { name: "Brain Stem Stroke", url: "/conditions/brain-stem-stroke/" },
//     { name: "Breast Cancer", url: "/conditions/breast-cancer/" },
//     { name: "Burnout", url: "/conditions/burnout/" },
//   ],
//   c: [
//     { name: "COVID Arm: What To Know", url: "/covid/covid-19-arm/" },
//     { name: "COVID-19 Fever Range", url: "/covid/covid-19-fever-range/" },
//     { name: "COVID-19 Guide", url: "/covid/" },
//     { name: "COVID-19 Symptom: Back Pain", url: "/covid/back-pain-covid-19/" },
//     { name: "COVID-19 Symptom: Blurry Vision", url: "/covid/covid-19-blurry-vision/" },
//     { name: "COVID-19 Symptom: Body Aches", url: "/covid/covid-19-symptom-body-aches/" },
//     { name: "COVID-19 Symptom: Brain Fog", url: "/covid/covid-19-brain-fog/" },
//     { name: "COVID-19 Symptom: Burning Nose", url: "/covid/covid-19-symptom-burning-nose/" },
//     { name: "COVID-19 Symptom: Clogged Ears", url: "/covid/clogged-ears-covid-19/" },
//     { name: "COVID-19 Symptom: Costochondritis", url: "/covid/covid-19-costochondritis/" },
//     { name: "COVID-19 Symptom: Cough", url: "/covid/covid-19-symptom-cough/" },
//     { name: "COVID-19 Symptom: Diarrhea", url: "/covid/covid-19-symptom-diarrhea/" },
//     { name: "COVID-19 Symptom: Dry Mouth", url: "/covid/covid-19-symptom-dry-mouth/" },
//     { name: "COVID-19 Symptom: Dry Nose", url: "/covid/covid-19-symptom-dry-nose/" },
//     { name: "COVID-19 Symptom: Ear Pain", url: "/covid/covid-19-symptom-ear-pain/" },
//     { name: "COVID-19 Symptom: Eyes Pain and Redness", url: "/covid/covid-19-eyes/" },
//     { name: "COVID-19 Symptom: Fatigue", url: "/covid/covid-19-symptom-fatigue/" },
//     { name: "COVID-19 Symptom: Headache", url: "/covid/covid-19-symptom-headache/" },
//     { name: "COVID-19 Symptom: Joint Pain", url: "/covid/covid-19-joint-pain/" },
//     { name: "COVID-19 Symptom: Kidney Pain", url: "/covid/covid-19-symptom-kidney-pain/" },
//     { name: "COVID-19 Symptom: Loss of Taste and Smell", url: "/covid/covid-19-symptom-loss-of-taste-and-smell/" },
//     { name: "COVID-19 Symptom: Metallic Taste", url: "/covid/covid-19-symptom-metallic-taste/" },
//     { name: "COVID-19 Symptom: Nose", url: "/covid/covid-19-symptom-nose/" },
//     { name: "COVID-19 Symptom: Nose Bleed", url: "/covid/bloody-nose-covid-19-symptom/" },
//     { name: "COVID-19 Symptom: Pink Eye", url: "/covid/pink-eye-symptom-of-covid-19/" },
//     { name: "COVID-19 Symptom: Rash in Adults", url: "/covid/covid-19-symptom-rash-in-adults/" },
//     { name: "COVID-19 Symptom: Runny Nose", url: "/covid/covid-19-symptom-runny-nose/" },
//     { name: "COVID-19 Symptom: Shortness of Breath", url: "/covid/covid-19-shortness-of-breath/" },
//     { name: "COVID-19 Symptom: Sore Throat", url: "/covid/covid-19-symptom-sore-throat/" },
//     { name: "COVID-19 Symptom: Stiff Neck", url: "/covid/covid-19-symptom-stiff-neck/" },
//     { name: "COVID-19 Symptom: Stomach Ache", url: "/covid/covid-19-symptom-stomach-ache/" },
//     { name: "COVID-19 Symptom: Tinnitus", url: "/covid/covid-19-tinnitus/" },
//     { name: "COVID-19 Symptom: Tongue Sores and Changes", url: "/covid/covid-19-symptom-tongue/" },
//     { name: "COVID-19 Symptom: migraine", url: "/covid/covid-19-migraine-symptom/" },
//     { name: "COVID-19 Symptoms", url: "/covid/covid-19-symptoms/" },
//     { name: "COVID-19 Symptoms and Effects on Male Genitals", url: "/covid/covid-19-symptoms-and-effects-on-male-genitals/" },
//     { name: "COVID-19 Symptoms: Delta variant in kids", url: "/covid/covid-19-delta-symptoms-in-kids/" },
//     { name: "COVID-19 Symptoms: Deltacron Variant", url: "/covid/covid-19-symptoms-deltacron-variant/" },
//     { name: "COVID-19 Symptoms: Doomsday COVID Variant", url: "/covid/covid-19-symptoms-doomsday-variant/" },
//     { name: "COVID-19 Symptoms: Insomnia", url: "/covid/covid-19-symptoms-insomnia/" },
//     { name: "COVID-19 Symptoms: Lambda Variant", url: "/covid/covid-19-symptoms-lambda-variant/" },
//     { name: "COVID-19 Symptoms: leg pain", url: "/covid/covid-19-leg-pain/" },
//     { name: "COVID-19 Symptoms: post nasal drip", url: "/covid/post-nasal-drip-and-covid-19/" },
//     { name: "COVID-19 Toes Symptoms", url: "/covid/covid-19-toes-symptoms/" },
//     { name: "COVID-19 Treatments and Medications", url: "/covid/treatment-guide/" },
//     { name: "COVID-19 and Asthma", url: "/covid/asthma-and-covid-19/" },
//     { name: "COVID-19 and Blood Type", url: "/covid/covid-and-blood-type/" },
//     { name: "COVID-19 and Breast Cancer", url: "/covid/covid-19-and-breast-cancer/" },
//     { name: "COVID-19 and Bronchitis", url: "/covid/covid-19-bronchitis/" },
//     { name: "COVID-19 and COPD", url: "/covid/copd-and-covid-19/" },
//     { name: "COVID-19 and Cancer", url: "/covid/covid-19-and-cancer/" },
//     { name: "COVID-19 and Constipation", url: "/covid/covid-19-and-constipation/" },
//     { name: "COVID-19 and Diabetes", url: "/covid/covid-19-symptom-diabetes/" },
//     { name: "COVID-19 and HIV or AIDS", url: "/covid/covid-19-hiv-and-aids/" },
//     { name: "COVID-19 and Hair Loss", url: "/covid/covid-19-hair-loss/" },
//     { name: "COVID-19 and Lupus", url: "/covid/lupus-and-covid-19/" },
//     { name: "COVID-19 and Obesity", url: "/covid/obesity-and-covid-19/" },
//     { name: "COVID-19 and Pneumonia", url: "/covid/covid-19-symptoms-and-pneumonia/" },
//     { name: "COVID-19 and Sinus Infection", url: "/covid/covid-19-sinus-infection/" },
//     { name: "COVID-19 and Weight Loss", url: "/covid/covid-19-weight-loss/" },
//     { name: "COVID-19 and arthritis", url: "/covid/covid-19-arthritis/" },
//     { name: "COVID-19 and blood clots", url: "/covid/covid-19-blood-clots/" },
//     { name: "COVID-19 and depression", url: "/covid/covid-19-and-depression/" },
//     { name: "COVID-19 and high blood pressure", url: "/covid/covid-19-high-blood-pressure/" },
//     { name: "COVID-19 and laryngitis", url: "/covid/covid-19-laryngitis/" },
//     { name: "COVID-19 and low body temp", url: "/covid/low-body-temp-and-covid-19/" },
//     { name: "COVID-19 and myocarditis", url: "/covid/myocarditis-and-covid-19/" },
//     { name: "COVID-19 and urinary tract infection (UTI)", url: "/covid/covid-19-uti-and-urinary-symptoms/" },
//     { name: "COVID-19 dizziness", url: "/covid/covid-19-dizziness/" },
//     { name: "COVID-19 in 2020", url: "/conditions/covid-19/" },
//     { name: "COVID-19 in 2023: is the pandemic over?", url: "/covid/covid-19-is-the-pandemic-over/" },
//     { name: "COVID-19 in older people", url: "/covid/covid-19-in-elderly/" },
//     { name: "COVID-19 rebound symptoms", url: "/covid/covid-19-rebound-symptoms/" },
//     { name: "COVID-19 symptom: chest pain", url: "/covid/covid-19-symptom-chest-pain/" },
//     { name: "COVID-19 symptom: heart palpitations", url: "/covid/covid-19-symptom-heart-palpitations/" },
//     { name: "COVID-19 symptom: night sweats", url: "/covid/covid-19-night-sweats/" },
//     { name: "COVID-19 symptom: rash in children", url: "/covid/covid-19-rash-in-children/" },
//     { name: "COVID-19 symptom: restless legs syndrome", url: "/covid/covid-19-restless-leg-syndrome/" },
//     { name: "COVID-19 symptoms vs. allergies", url: "/covid/covid-19-vs-allergies/" },
//     { name: "COVID-19 symptoms: Omicron vs. Delta", url: "/covid/covid-19-omicron-vs-delta-symptoms/" },
//     { name: "COVID-19 symptoms: tonsillitis", url: "/covid/covid-19-tonsillitis/" },
//     { name: "COVID-19 vs Cold Symptoms", url: "/covid/covid-19-vs-cold-symptoms/" },
//     { name: "COVID-19 vs. flu symptoms", url: "/covid/covid-19-vs-flu-symptoms/" },
//     { name: "COVID-19 vs. strep throat symptoms", url: "/covid/strep-vs-covid-19-symptoms/" },
//     { name: "COVID-19 without fever", url: "/covid/covid-19-without-fever/" },
//     { name: "COVID-19: Arcturus variant", url: "/covid/arcturus-covid-19-variant/" },
//     { name: "COVID-19: BA.2.86 variant symptoms (Pirola)", url: "/covid/covid-19-variant-ba286-pirola/" },
//     { name: "COVID-19: Delta Variant Symptoms", url: "/covid/covid-19-symptoms-delta-variant/" },
//     { name: "COVID-19: JN.1 Variant Symptoms", url: "/covid/jn1-covid-variant-symptoms/" },
//     { name: "COVID-19: Loss of Appetite", url: "/covid/covid-19-loss-of-appetite/" },
//     { name: "COVID-19: Lung Symptoms and Damage", url: "/covid/covid-19-lungs-symptoms/" },
//     { name: "COVID-19: Nausea and Vomiting", url: "/covid/covid-19-symptoms-nausea-and-vomiting/" },
//     { name: "COVID-19: New Variants in 2025", url: "/covid/what-strain-of-covid-is-going-around/" },
//     { name: "COVID-19: Omicron variant symptoms", url: "/covid/covid-19-omicron-variant-symptoms/" },
//     { name: "COVID-19: Smoking and Nicotine", url: "/covid/smoking-and-covid-19/" },
//     { name: "COVID-19: Vulnerable groups at risk of severe illness", url: "/covid/covid-19-high-risk-groups/" },
//     { name: "COVID-19: What to do if you test positive", url: "/covid/what-to-do-if-you-test-positive-for-covid/" },
//     { name: "COVID-19: can COVID affect your period?", url: "/covid/can-covid-affect-your-period/" },
//     { name: "COVID-19: incubation period", url: "/covid/covid-19-incubation-period/" },
//     { name: "COVID-19: recovery time", url: "/covid/covid-19-recovery-time/" },
//     { name: "COVID-19: swollen lymph nodes", url: "/covid/covid-19-swollen-lymph-nodes/" },
//     { name: "Candida Vulvovaginitis (vaginal thrush)", url: "/conditions/candida-vulvovaginitis/" },
//     { name: "Cardiovascular Disease Guide", url: "/cardiovascular/" },
//     { name: "Cardiovascular Disease Risk Factors", url: "/cardiovascular/cardiovascular-disease-risk-factors/" },
//     { name: "Carpal Tunnel Syndrome (CTS)", url: "/conditions/carpal-tunnel-syndrome/" },
//     { name: "Cataracts", url: "/conditions/cataracts/" },
//     { name: "Causes of Miscarriage", url: "/causes-of-miscarriage/" },
//     { name: "Celiac Disease", url: "/conditions/coeliac-disease/" },
//     { name: "Central sleep apnea", url: "/conditions/central-sleep-apnea/" },
//     { name: "Cerebellar ataxia", url: "/conditions/cerebellar-ataxia/" },
//     { name: "Cervical Cancer", url: "/conditions/cervical-cancer/" },
//     { name: "Cervicitis", url: "/conditions/cervicitis/" },
//     { name: "Charcot-Marie-Tooth disease", url: "/conditions/charcot-marie-tooth-disease/" },
//     { name: "Chemotherapy Side-Effects", url: "/chemotherapy-side-effects/" },
//     { name: "Chest Cold", url: "/conditions/chest-cold/" },
//     { name: "Childhood Absence Epilepsy", url: "/conditions/childhood-absence-epilepsy/" },
//     { name: "Childhood Asthma", url: "/conditions/childhood-asthma/" },
//     { name: "Chiragra", url: "/conditions/chiragra/" },
//     { name: "Chlamydia Infection", url: "/conditions/chlamydia-infection/" },
//     { name: "Chlamydia Test", url: "/sexual-health/at-home-chlamydia-test/" },
//     { name: "Cholecystitis", url: "/conditions/cholecystitis/" },
//     { name: "Cholera", url: "/conditions/cholera/" },
//     { name: "Cholesterol Guide", url: "/cardiovascular/cholesterol/" },
//     { name: "Chronic Bronchitis", url: "/conditions/chronic-bronchitis/" },
//     { name: "Chronic Gastritis", url: "/conditions/chronic-gastritis/" },
//     { name: "Chronic Heart Failure", url: "/conditions/chronic-heart-failure/" },
//     { name: "Chronic Idiopathic Constipation", url: "/conditions/chronic-idiopathic-constipation/" },
//     { name: "Chronic Laryngitis", url: "/conditions/chronic-laryngitis/" },
//     { name: "Chronic Pancreatitis", url: "/conditions/chronic-pancreatitis/" },
//     { name: "Chronic Pelvic Pain", url: "/conditions/chronic-pelvic-pain/" },
//     { name: "Chronic Pharyngitis", url: "/conditions/chronic-pharyngitis/" },
//     { name: "Chronic Renal Failure", url: "/conditions/chronic-renal-failure/" },
//     { name: "Chronic migraines", url: "/conditions/chronic-migraines/" },
//     { name: "Cluster Headaches (CHs)", url: "/conditions/cluster-headaches/" },
//     { name: "Cold Sores (Herpes Labialis)", url: "/conditions/herpes-labialis/" },
//     { name: "Colorectal Cancer", url: "/conditions/colorectal-cancer/" },
//     { name: "Colostomy Bag", url: "/colostomy-bag/" },
//     { name: "Common Cold", url: "/conditions/common-cold/" },
//     { name: "Common Warts", url: "/conditions/common-warts/" },
//     { name: "Concussion Syndrome", url: "/conditions/concussion-syndrome/" },
//     { name: "Congenital Hypothyroidism", url: "/conditions/congenital-hypothyroidism/" },
//     { name: "Conjunctivitis (Pink Eye)", url: "/conditions/conjunctivitis/" },
//     { name: "Contact Dermatitis", url: "/conditions/contact-dermatitis/" },
//     { name: "Contusions and Bruises", url: "/conditions/contusion-bruise/" },
//     { name: "Conversion Disorder", url: "/conditions/conversion-disorder/" },
//     { name: "Copper", url: "/micronutrients/copper/" },
//     { name: "Coronary Artery Disease", url: "/conditions/coronary-artery-disease/" },
//     { name: "Costochondritis", url: "/conditions/costochondritis/" },
//     { name: "Covid-19 and Anxiety", url: "/covid/covid-19-and-anxiety/" },
//     { name: "Cradle Cap", url: "/conditions/cradle-cap/" },
//     { name: "Crohn’s Disease", url: "/conditions/crohns-disease/" },
//     { name: "Cryptorchidism", url: "/conditions/cryptorchidism/" },
//     { name: "Cushing’s Syndrome", url: "/conditions/cushings-syndrome/" },
//     { name: "Cutaneous Burns", url: "/conditions/cutaneous-burns/" },
//     { name: "Cyclothymic Disorder", url: "/conditions/cyclothymic-disorder/" },
//     { name: "Cystic Fibrosis", url: "/conditions/cystic-fibrosis/" },
//     { name: "Cytomegalovirus (CMV) Infection", url: "/conditions/cytomegalovirus-infection/" },
//   ],
//   d: [
//     { name: "Dementia With Lewy Bodies", url: "/conditions/dementia-with-lewy-bodies/" },
//     { name: "Dengue Fever", url: "/conditions/dengue-fever/" },
//     { name: "Dental Abscess", url: "/conditions/dental-abscess/" },
//     { name: "Depression in Childhood or Adolescence", url: "/conditions/depression-in-childhood-or-adolescence/" },
//     { name: "Depressive Episode", url: "/conditions/depressive-episode/" },
//     { name: "Developmental Dysplasia of the Hip", url: "/conditions/developmental-dysplasia-of-the-hip/" },
//     { name: "Diabetes", url: "/conditions/diabetes/" },
//     { name: "Diabetes Insipidus", url: "/conditions/diabetes-insipidus/" },
//     { name: "Diabetes type 2", url: "/conditions/diabetes-mellitus-type-2/" },
//     { name: "Diaper Rash", url: "/conditions/diaper-rash/" },
//     { name: "Disseminated Tuberculosis", url: "/conditions/disseminated-tuberculosis/" },
//     { name: "Diverticulitis", url: "/conditions/diverticulitis/" },
//     { name: "Donovanosis (granuloma inguinale)", url: "/conditions/donovanosis/" },
//   ],
//   e: [
//     { name: "Early Disseminated Lyme Disease", url: "/conditions/early-disseminated-lyme-disease/" },
//     { name: "Early Localized Lyme Disease", url: "/conditions/early-localized-lyme-disease/" },
//     { name: "Ebola Virus Disease", url: "/conditions/ebola-virus-disease/" },
//     { name: "Ectopic Pregnancy", url: "/conditions/ectopic-pregnancy/" },
//     { name: "Endocarditis", url: "/conditions/endocarditis/" },
//     { name: "Endometrial Cancer", url: "/conditions/endometrial-cancer/" },
//     { name: "Endometrial Polyps", url: "/conditions/endometrial-polyps/" },
//     { name: "Endometriosis", url: "/conditions/endometriosis/" },
//     { name: "Enlarged Prostate", url: "/conditions/enlarged-prostate/" },
//     { name: "Epstein-Barr Virus (EBV)", url: "/conditions/epstein-barr-virus/" },
//     { name: "Erectile Dysfunction", url: "/conditions/erectile-dysfunction/" },
//     { name: "Esophageal Cancer", url: "/conditions/esophageal-cancer/" },
//     { name: "Essential Hypertension", url: "/conditions/essential-hypertension/" },
//     { name: "Essential Tremor", url: "/conditions/essential-tremor/" },
//     { name: "Estradiol", url: "/hormones/estradiol/" },
//   ],
//   f: [
//     { name: "FSH (Follicle-Stimulating Hormone)", url: "/hormones/follicle-stimulating-hormone/" },
//     { name: "Fabry Disease", url: "/conditions/fabry-disease/" },
//     { name: "Failure to Thrive", url: "/conditions/failure-to-thrive/" },
//     { name: "Familial Hypercholesterolemia", url: "/conditions/familial-hypercholesterolemia/" },
//     { name: "Familial Mediterranean Fever (FMF)", url: "/conditions/familial-mediterranean-fever/" },
//     { name: "Febrile Seizure", url: "/conditions/febrile-seizure/" },
//     { name: "Fetal Alcohol Spectrum Disorders", url: "/conditions/fetal-alcohol-spectrum-disorders/" },
//     { name: "Fibrocystic Breasts", url: "/conditions/fibrocystic-breasts/" },
//     { name: "Fibrodysplasia ossificans progressiva (FOP)", url: "/conditions/fibrodysplasia-ossificans-progressiva/" },
//     { name: "Fibromyalgia", url: "/conditions/fibromyalgia/" },
//     { name: "Folate Deficiency", url: "/conditions/folate-deficiency/" },
//     { name: "Food Allergy", url: "/conditions/food-allergy/" },
//     { name: "Foods to Avoid During Pregnancy", url: "/foods-to-avoid-during-pregnancy/" },
//     { name: "Foods to Eat During Pregnancy", url: "/foods-to-eat-during-pregnancy/" },
//     { name: "Foreign Body Aspiration", url: "/conditions/foreign-body-aspiration/" },
//     { name: "Foreign Body Ingestion", url: "/conditions/foreign-body-ingestion/" },
//     { name: "Free T4 Blood Test", url: "/thyroid/free-t4-blood-test/" },
//     { name: "Friedreich's Ataxia", url: "/conditions/friedreich-ataxia/" },
//     { name: "Functional Dyspepsia", url: "/conditions/functional-dyspepsia/" },
//   ],
//   g: [
//     { name: "Gallbladder Cancer", url: "/conditions/gallbladder-cancer/" },
//     { name: "Gallstones (Symptomatic Cholelithiasis)", url: "/conditions/symptomatic-cholelithiasis/" },
//     { name: "Gastroenteritis", url: "/conditions/gastroenteritis/" },
//     { name: "Gastroesophageal Reflux Disease", url: "/conditions/gastroesophageal-reflux-disease/" },
//     { name: "Generalized Anxiety Disorder", url: "/conditions/generalized-anxiety-disorder/" },
//     { name: "Generalized Seizure", url: "/conditions/generalized-seizure/" },
//     { name: "Genital Herpes", url: "/conditions/genital-herpes/" },
//     { name: "Genital Warts", url: "/conditions/genital-warts/" },
//     { name: "Gonorrhea Infection", url: "/conditions/gonorrhea-infection/" },
//     { name: "Gout", url: "/conditions/gout/" },
//     { name: "Graves’ Disease", url: "/conditions/graves-disease/" },
//   ],
//   h: [
//     { name: "HDL Cholesterol", url: "/biomarkers/hdl-cholesterol/" },
//     { name: "HIV Test", url: "/sexual-health/at-home-hiv-test/" },
//     { name: "HIV and AIDS", url: "/conditions/hiv-aids/" },
//     { name: "HIV and dementia", url: "/conditions/hiv-dementia/" },
//     { name: "HIV and tongue symptoms", url: "/conditions/signs-of-hiv-on-tongue/" },
//     { name: "HIV symptom: swollen lymph nodes", url: "/conditions/hiv-swollen-lymph-node/" },
//     { name: "HIV symptoms in men", url: "/conditions/hiv-symptoms-in-men/" },
//     { name: "HIV symptoms in women", url: "/conditions/hiv-symptoms-in-women/" },
//     { name: "HIV symptoms skin rash", url: "/conditions/hiv-symptoms-rash/" },
//     { name: "HIV symptoms: fever", url: "/conditions/hiv-fever-symptom/" },
//     { name: "HIV symptoms: sore throat", url: "/conditions/hiv-symptoms-sore-throat/" },
//     { name: "HIV transmission: how is HIV transmitted?", url: "/conditions/how-is-hiv-transmitted/" },
//     { name: "HPV (Human papillomavirus)", url: "/conditions/human-papillomavirus-hpv-infection/" },
//     { name: "Hashimoto’s Thyroiditis Hypothyroidism", url: "/conditions/hashimotos-thyroiditis-hypothyroidism/" },
//     { name: "Hay Fever", url: "/conditions/hay-fever/" },
//     { name: "Headache", url: "/conditions/headache/" },
//     { name: "Hemiplegic migraine", url: "/conditions/hemiplegic-migraine/" },
//     { name: "Hemoglobin", url: "/biomarkers/hemoglobin/" },
//     { name: "Hemoglobin A1c", url: "/biomarkers/hemoglobin-a1c/" },
//     { name: "Hemoglobin levels", url: "/hemoglobin-levels/" },
//     { name: "Hemophilia", url: "/conditions/hemophilia/" },
//     { name: "Hemorrhagic Stroke", url: "/conditions/hemorrhagic-stroke/" },
//     { name: "Hemorrhoids", url: "/conditions/hemorrhoids/" },
//     { name: "Herpangina", url: "/conditions/herpangina/" },
//     { name: "Herpes Simplex", url: "/conditions/herpes-simplex/" },
//     { name: "Herpes Zoster Infection", url: "/conditions/herpes-zoster-infection/" },
//     { name: "Herpes Zoster Ophthalmicus", url: "/conditions/herpes-zoster-ophthalmicus/" },
//     { name: "Hgb Blood Test", url: "/biomarkers/hgb-blood-test/" },
//     { name: "Hidradenitis suppurativa (HS)", url: "/conditions/hidradenitis-suppurativa/" },
//     { name: "Hormones Guide", url: "/hormones/" },
//     { name: "Human Herpesvirus (HHV)", url: "/conditions/human-herpesvirus/" },
//     { name: "Hypertensive Retinopathy", url: "/conditions/hypertensive-retinopathy/" },
//     { name: "Hyperthyroidism", url: "/conditions/hyperthyroidism/" },
//     { name: "Hypoglycemia (Unspecified)", url: "/conditions/hypoglycemia-unspecified/" },
//     { name: "Hypothermia", url: "/conditions/hypothermia/" },
//     { name: "Hypothyroidism", url: "/conditions/hypothyroidism/" },
//   ],
//   i: [
//     { name: "Idiopathic nephrotic syndrome", url: "/conditions/idiopathic-nephrotic-syndrome/" },
//     { name: "Impetigo", url: "/conditions/impetigo/" },
//     { name: "Infantile Atopic Dermatitis", url: "/conditions/infantile-atopic-dermatitis/" },
//     { name: "Infantile Colic", url: "/conditions/infantile-colic/" },
//     { name: "Infective Endocarditis", url: "/conditions/infective-endocarditis/" },
//     { name: "Influenza (flu)", url: "/conditions/influenza-infection/" },
//     { name: "Inguinal Hernia", url: "/conditions/inguinal-hernia/" },
//     { name: "Iron Deficiency (Anemia)", url: "/conditions/iron-deficiency-anemia/" },
//     { name: "Irritable Bowel Syndrome", url: "/conditions/irritable-bowel-syndrome/" },
//     { name: "Ischemic Stroke", url: "/conditions/ischemic-stroke/" },
//   ],
//   j: [
//     { name: "Juvenile Idiopathic Arthritis", url: "/conditions/juvenile-idiopathic-arthritis/" },
//     { name: "Juvenile Rheumatoid Arthritis", url: "/conditions/juvenile-rheumatoid-arthritis/" },
//   ],
//   k: [
//     { name: "Keratoconjunctivitis Sicca (Dry Eye Syndrome)", url: "/conditions/keratoconjunctivitis-sicca/" },
//     { name: "Keyhole Surgery", url: "/keyhole-surgery/" },
//   ],
//   l: [
//     { name: "LDL Cholesterol", url: "/biomarkers/ldl-cholesterol/" },
//     { name: "Laryngeal Cancer", url: "/conditions/laryngeal-cancer/" },
//     { name: "Late Lyme Disease", url: "/conditions/late-lyme-disease/" },
//     { name: "Legionella Infection", url: "/conditions/legionella-infection/" },
//     { name: "Liver Cirrhosis", url: "/conditions/liver-cirrhosis/" },
//     { name: "Loiasis", url: "/conditions/loiasis/" },
//     { name: "Long COVID symptoms: long-term effects of COVID", url: "/covid/covid-19-long-covid/" },
//     { name: "Lower Gastrointestinal Hemorrhage", url: "/conditions/lower-gastrointestinal-hemorrhage/" },
//     { name: "Luteinizing hormone (LH)", url: "/hormones/luteinizing-hormone/" },
//     { name: "Lyme Disease", url: "/conditions/lyme-disease/" },
//   ],
//   m: [
//     { name: "Magnesium", url: "/micronutrients/magnesium/" },
//     { name: "Malaria", url: "/conditions/malaria/" },
//     { name: "Measles (Rubeola)", url: "/conditions/measles/" },
//     { name: "Melanoma", url: "/conditions/melanoma/" },
//     { name: "Menopause", url: "/conditions/menopause/" },
//     { name: "Menstrual Disorders", url: "/conditions/menstrual-disorders/" },
//     { name: "Mesothelioma", url: "/conditions/mesothelioma/" },
//     { name: "Micronutrients Guide", url: "/micronutrients/" },
//     { name: "Middle Ear Infection", url: "/conditions/middle-ear-infection/" },
//     { name: "Migraine", url: "/conditions/migraine-headache/" },
//     { name: "Migraine Headache", url: "/conditions/migraine/" },
//     { name: "Migraine with aura", url: "/conditions/migraine-with-aura/" },
//     { name: "Minor Head Trauma", url: "/conditions/minor-head-trauma/" },
//     { name: "Miscarriage", url: "/conditions/miscarriage/" },
//     { name: "Molar Pregnancy", url: "/conditions/molar-pregnancy/" },
//     { name: "Morning Sickness", url: "/conditions/morning-sickness/" },
//     { name: "Mpox", url: "/conditions/mpox/" },
//     { name: "Multiple Myeloma", url: "/conditions/multiple-myeloma/" },
//     { name: "Multiple Sclerosis", url: "/conditions/multiple-sclerosis/" },
//     { name: "Mumps", url: "/conditions/mumps/" },
//     { name: "Muscle Soreness", url: "/conditions/muscle-soreness/" },
//     { name: "Muscle Strain", url: "/conditions/muscle-strain/" },
//     { name: "Muscle and Joint Pain", url: "/conditions/muscle-joint-pain/" },
//     { name: "Musculoskeletal Lower Back Pain", url: "/conditions/musculoskeletal-lower-back-pain/" },
//     { name: "Musculoskeletal Pain", url: "/conditions/musculoskeletal-pain/" },
//     { name: "Myasthenia Gravis", url: "/conditions/myasthenia-gravis/" },
//     { name: "Myocardial Infarction", url: "/conditions/myocardial-infarction/" },
//     { name: "Myocarditis", url: "/conditions/myocarditis/" },
//   ],
//   n: [
//     { name: "Nappy Rash", url: "/conditions/nappy-rash/" },
//     { name: "Necrotizing Periodontal Disease", url: "/conditions/necrotizing-periodontal-disease/" },
//     { name: "Neonatal Jaundice", url: "/conditions/neonatal-jaundice/" },
//     { name: "Nephritic Syndrome", url: "/conditions/nephritic-syndrome/" },
//     { name: "Nephrolithiasis (Kidney Stones)", url: "/conditions/nephrolithiasis/" },
//     { name: "Nephrotic Syndrome", url: "/conditions/nephrotic-syndrome/" },
//     { name: "Non-Allergic Rhinitis", url: "/conditions/non-allergic-rhinitis/" },
//     { name: "Non-Small Cell Lung Cancer", url: "/conditions/non-small-cell-lung-cancer/" },
//     { name: "Nonbacterial Prostatitis", url: "/conditions/nonbacterial-prostatitis/" },
//   ],
//   o: [
//     { name: "Obsessive Compulsive Disorder", url: "/conditions/obsessive-compulsive-disorder/" },
//     { name: "Obstructive sleep apnea", url: "/conditions/obstructive-sleep-apnea/" },
//     { name: "Ocular migraine", url: "/conditions/ocular-migrain/" },
//     { name: "Onychomycosis (Fungal Nail Infection)", url: "/conditions/onychomycosis-fungal-nail-infection/" },
//     { name: "Open Angle Glaucoma", url: "/conditions/open-angle-glaucoma/" },
//     { name: "Oropharyngeal Cancer", url: "/conditions/oropharyngeal-cancer/" },
//     { name: "Osteomalacia", url: "/conditions/osteomalacia/" },
//     { name: "Osteoporosis", url: "/conditions/osteoporosis/" },
//     { name: "Otitis Externa", url: "/conditions/otitis-externa/" },
//     { name: "Ovarian Cancer", url: "/conditions/ovarian-cancer/" },
//   ],
//   p: [
//     { name: "Pancreatic Cancer", url: "/conditions/pancreatic-cancer/" },
//     { name: "Parkinson’s Disease", url: "/conditions/parkinsons-disease/" },
//     { name: "Pediatric Acute Otitis Media", url: "/conditions/pediatric-acute-otitis-media/" },
//     { name: "Pediatric Pneumonia (babies and children)", url: "/conditions/pediatric-pneumonia/" },
//     { name: "Pediatric Urinary Tract Infection", url: "/conditions/pediatric-urinary-tract-infection/" },
//     { name: "Pediatric Viral Gastroenteritis", url: "/conditions/pediatric-viral-gastroenteritis/" },
//     { name: "Pelvic inflammatory disease (PID)", url: "/conditions/pelvic-inflammatory-disease/" },
//     { name: "Peptic Ulcer Disease", url: "/conditions/peptic-ulcer-disease/" },
//     { name: "Pericardial Effusion", url: "/conditions/pericardial-effusion/" },
//     { name: "Pericarditis (Inflammation of the Heart Membrane)", url: "/conditions/pericarditis/" },
//     { name: "Pericarditis and COVID-19", url: "/covid/pericarditis-and-covid-19/" },
//     { name: "Perimenopause", url: "/conditions/perimenopause/" },
//     { name: "Peripheral Vascular Disease", url: "/conditions/peripheral-vascular-disease/" },
//     { name: "Pertussis", url: "/conditions/pertussis/" },
//     { name: "Plantar Warts", url: "/conditions/plantar-warts/" },
//     { name: "Plaque psoriasis", url: "/conditions/plaque-psoriasis/" },
//     { name: "Pneumonia", url: "/conditions/pneumonia/" },
//     { name: "Pneumothorax", url: "/conditions/pneumothorax/" },
//     { name: "Podagra", url: "/conditions/podagra/" },
//     { name: "Poliovirus Infection", url: "/conditions/poliovirus-infection/" },
//     { name: "Polycystic Ovary Syndrome", url: "/conditions/polycystic-ovary-syndrome/" },
//     { name: "Polymyalgia Rheumatica", url: "/conditions/polymyalgia-rheumatica/" },
//     { name: "Post Traumatic Stress Disorder (PTSD)", url: "/conditions/post-traumatic-stress-disorder/" },
//     { name: "Post-Concussion Syndrome (PCS)", url: "/conditions/post-concussion-syndrome/" },
//     { name: "Post-Streptococcal Glomerulonephritis", url: "/conditions/post-streptococcal-glomerulonephritis/" },
//     { name: "Precocious puberty", url: "/conditions/precocious-puberty/" },
//     { name: "Preeclampsia", url: "/conditions/preeclampsia/" },
//     { name: "Pregnancy", url: "/conditions/pregnancy/" },
//     { name: "Premature Labor", url: "/conditions/premature-labor/" },
//     { name: "Premenstrual Dysphoric Disorder (PMDD)", url: "/conditions/premenstrual-dysphoric-disorder-pmdd/" },
//     { name: "Premenstrual syndrome (PMS)", url: "/conditions/premenstrual-syndrome/" },
//     { name: "Preparing for a Colonoscopy", url: "/preparing-for-a-colonoscopy/" },
//     { name: "Pressure Ulcer", url: "/conditions/pressure-ulcer/" },
//     { name: "Progesterone", url: "/hormones/progesterone/" },
//     { name: "Prolactin Hormone", url: "/hormones/prolactin/" },
//     { name: "Prostate Cancer", url: "/conditions/prostate-cancer/" },
//     { name: "Prostatectomy (Prostate Surgery)", url: "/conditions/prostatectomy-prostate-surgery/" },
//     { name: "Psoriasis", url: "/conditions/psoriasis/" },
//     { name: "Pulmonary Embolism", url: "/conditions/pulmonary-embolism/" },
//   ],
//   q: [
//     { name: "Q", url: "#" },
   
//   ],
//   r: [
//     { name: "Reactive Arthritis", url: "/conditions/reactive-arthritis/" },
//     { name: "Recurrent Stomach Discomfort", url: "/conditions/recurrent-stomach-discomfort/" },
//     { name: "Repetitive Strain Injury (RSI)", url: "/conditions/repetitive-strain-injury/" },
//     { name: "Restless Legs Syndrome (RLS)", url: "/conditions/restless-legs-syndrome/" },
//     { name: "Rheumatic Fever", url: "/conditions/rheumatic-fever/" },
//     { name: "Rheumatoid Arthritis", url: "/conditions/rheumatoid-arthritis/" },
//     { name: "Rickets", url: "/conditions/rickets/" },
//     { name: "Rosacea", url: "/conditions/rosacea/" },
//     { name: "Roseola Infantum", url: "/conditions/roseola-infantum/" },
//     { name: "Rubella", url: "/conditions/rubella/" },
//   ],
//   s: [
//     { name: "SHGB (Sex hormone binding globulin)", url: "/hormones/sex-hormone-binding-globulin-shgb/" },
//     { name: "Scabies", url: "/conditions/scabies/" },
//     { name: "Schizophrenia", url: "/conditions/schizophrenia/" },
//     { name: "Schnitzler syndrome", url: "/conditions/schnitzler-syndrome/" },
//     { name: "Seasonal Affective Disorder", url: "/conditions/seasonal-affective-disorder/" },
//     { name: "Secondary Syphilis", url: "/conditions/secondary-syphilis/" },
//     { name: "Selenium", url: "/micronutrients/selenium/" },
//     { name: "Sepsis", url: "/conditions/sepsis/" },
//     { name: "Septic Arthritis", url: "/conditions/septic-arthritis/" },
//     { name: "Sexually Transmitted Diseases (STD): Sexual Health Guide", url: "/sexual-health/" },
//     { name: "Sickle Cell Disease", url: "/conditions/sickle-cell-disease/" },
//     { name: "Signs of Autism", url: "/signs-of-autism/" },
//     { name: "Signs of Depression", url: "/signs-of-depression/" },
//     { name: "Signs of Ear Infection", url: "/signs-of-ear-infection/" },
//     { name: "Signs of Hemorrhoids", url: "/signs-of-hemorrhoids/" },
//     { name: "Signs of Herpes", url: "/signs-of-herpes/" },
//     { name: "Signs of Kidney Problems", url: "/signs-of-kidney-problems/" },
//     { name: "Signs of Miscarriage", url: "/signs-of-miscarriage/" },
//     { name: "Signs of Panic Attack", url: "/conditions/signs-of-panic-attack/" },
//     { name: "Signs of Postpartum Depression", url: "/signs-of-postpartum-depression/" },
//     { name: "Signs of Shingles: Herpes Zoster", url: "/signs-of-shingles/" },
//     { name: "Signs of Stroke", url: "/signs-of-stroke/" },
//     { name: "Signs of a Concussion", url: "/signs-of-concussion/" },
//     { name: "Signs of burnout", url: "/signs-of-burnout/" },
//     { name: "Sleep apnea", url: "/conditions/sleep-apnea/" },
//     { name: "Small Cell Lung Cancer", url: "/conditions/small-cell-lung-cancer/" },
//     { name: "Smoke Inhalation", url: "/conditions/smoke-inhalation/" },
//     { name: "Sprains", url: "/conditions/sprain/" },
//     { name: "Stomach Cancer", url: "/conditions/stomach-cancer/" },
//     { name: "Subarachnoid Hemorrhage", url: "/conditions/subarachnoid-hemorrhage/" },
//     { name: "Subluxation and Dislocation of the Hip", url: "/conditions/subluxation-and-dislocation-of-the-hip/" },
//     { name: "Subluxation or Dislocation of the Radial Head", url: "/conditions/subluxation-or-dislocation-of-the-radial-head/" },
//     { name: "Syphilis Infection", url: "/conditions/syphilis-infection/" },
//     { name: "Syphilis Test", url: "/sexual-health/at-home-syphilis-test/" },
//     { name: "Systemic Lupus Erythematosus", url: "/conditions/systemic-lupus-erythematosus/" },
//   ],
//   t: [
//     { name: "TPO Antibodies", url: "/thyroid/tpo-antibodies/" },
//     { name: "Tendonitis", url: "/conditions/tendonitis/" },
//     { name: "Tension Headache", url: "/conditions/tension-type-headache/" },
//     { name: "Testicular Cancer", url: "/conditions/testicular-cancer/" },
//     { name: "Testicular Torsion", url: "/conditions/testicular-torsion/" },
//     { name: "Testosterone", url: "/hormones/testosterone/" },
//     { name: "Tetanus", url: "/conditions/tetanus/" },
//     { name: "Thalassemia", url: "/conditions/thalassemia/" },
//     { name: "Thyroid Guide", url: "/thyroid/" },
//     { name: "Thyroid Stimulating Hormone TSH", url: "/thyroid/thyroid-stimulating-hormone-tsh/" },
//     { name: "Thyroiditis", url: "/conditions/thyroiditis/" },
//     { name: "Thyroxine T4", url: "/thyroid/thyroxine-t4/" },
//     { name: "Tietze Syndrome", url: "/conditions/tietze-syndrome/" },
//     { name: "Tonsillitis", url: "/conditions/tonsillitis/" },
//     { name: "Transient Ischemic Attack (TIA)", url: "/conditions/transient-ischemic-attack/" },
//     { name: "Trichomonas Vulvovaginitis", url: "/conditions/trichomonas-vulvovaginitis/" },
//     { name: "Trichomoniasis Test", url: "/sexual-health/trichomoniasis-test/" },
//     { name: "Trigeminal Neuralgia", url: "/conditions/trigeminal-neuralgia/" },
//     { name: "Triglycerides", url: "/biomarkers/triglycerides/" },
//     { name: "Triiodothyronine T3", url: "/thyroid/triiodothyronine-t3/" },
//     { name: "Tuberculosis", url: "/conditions/tuberculosis/" },
//     { name: "Typhoid Fever", url: "/conditions/typhoid-fever/" },
//   ],
//   u: [
//     { name: "Ulcerative Colitis (UC)", url: "/conditions/ulcerative-colitis/" },
//     { name: "Unstable Angina Pectoris", url: "/conditions/unstable-angina-pectoris/" },
//     { name: "Upper Gastrointestinal Hemorrhage", url: "/conditions/upper-gastrointestinal-hemorrhage/" },
//     { name: "Urinary Incontinence (UI)", url: "/conditions/urinary-incontinence/" },
//     { name: "Urinary Tract Infection (UTI)", url: "/conditions/urinary-tract-infection/" },
//     { name: "Uveitis", url: "/conditions/uveitis/" },
//   ],
//   v: [
//     { name: "VMS: vasomotor symptoms (hot flashes)", url: "/conditions/vasomotor-symptoms-hot-flashes/" },
//     { name: "Varicella Zoster Virus", url: "/conditions/varicella-zoster-virus/" },
//     { name: "Vestibular migraine", url: "/conditions/vestibular-migraine/" },
//     { name: "Viral Conjunctivitis", url: "/conditions/viral-conjunctivitis/" },
//     { name: "Viral Meningitis", url: "/conditions/viral-meningitis/" },
//     { name: "Viral Sinusitis (Sinus Infection)", url: "/conditions/viral-sinusitis/" },
//     { name: "Viral gastroenteritis (stomach flu)", url: "/conditions/viral-gastroenteritis/" },
//     { name: "Vitamin B12", url: "/micronutrients/vitamin-b12/" },
//     { name: "Vitamin B12 Deficiency", url: "/conditions/vitamin-b12-deficiency/" },
//     { name: "Vitamin D", url: "/micronutrients/vitamin-d/" },
//     { name: "Vitamin D Deficiency", url: "/conditions/vitamin-d-deficiency/" },
//     { name: "Vitamin Deficiency Test", url: "/micronutrients/vitamin-deficiency-test/" },
//     { name: "Vitamin E", url: "/micronutrients/vitamin-e/" },
//     { name: "Vitamin K Deficiency", url: "/conditions/vitamin-k-deficiency/" },
//   ],
//   w: [
//     { name: "White Blood Cell Count", url: "/white-blood-cell-count/" },
//   ],
//   x: [
//     { name: "X", url: "#" },
//   ],
//   y: [
//     { name: "Y", url: "#" },
//   ],
//   z: [
//     { name: "Zinc", url: "/micronutrients/zinc/" },
//   ],
};

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

const MedicalLibrary: React.FC = () => {
    const navigate = useNavigate();
  const { url } = useParams<{ url: string }>();
  const [selectedLetter, setSelectedLetter] = useState<string>('a');
  const [searchQuery, setSearchQuery] = useState<string>('');
const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Sync selectedLetter with URL param
  useEffect(() => {
    if (url && conditionsData[url.toLowerCase()]) {
      setSelectedLetter(url.toLowerCase());
    } else if (!url) {
      setSelectedLetter('a');
    } else if (url && !conditionsData[url.toLowerCase()]) {
      // Invalid letter, redirect to /library
      navigate('/conditions', { replace: true });
    }
  }, [url, navigate]);

  const handleLetterClick = (letter: string) => {
    if (conditionsData[letter]) {
      setSelectedLetter(letter);
      setSearchQuery('');
      navigate(`/conditions/${letter}`); // Update URL
    }
  };
  const displayedConditions = useMemo(() => {
    const conditions = conditionsData[selectedLetter] || [];
    if (!searchQuery.trim()) return conditions;
    return conditions.filter(condition =>
      condition.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedLetter, searchQuery]);

 const clearSearch = () => {
    setSearchQuery('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
   return (
    <div className="bg-light">
      <Header />

      {/* Hero Section with Gradient */}
      <div className="position-relative text-white" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)', minHeight: '400px' }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold mb-4">Medical Library</h1>
              <p className="lead mb-4">
                The right health information leads to the right health actions. This library is stocked with tips that can help you stay well and facts about medical conditions. Everything you'll learn here is based on our doctors' clinical experience and the latest research.
              </p>
            {/* <div className="d-flex justify-content-center gap-3 flex-wrap">
  <a 
    href="#" 
    className="btn btn-lg px-4 rounded-pill text-white fw-semibold"
    style={{
      background: "linear-gradient(45deg, #007bff, #00c6ff)",
      border: "none"
    }}
  >
    App Store
  </a>

  <a 
    href="#" 
    className="btn btn-lg px-4 rounded-pill text-white"
    style={{
      background: "linear-gradient(45deg, #34A853, #0f9d58)",
      border: "none"
    }}
  >
    Google Play
  </a>
</div> */}
            </div>
          </div>
        </div>
        {/* Decorative wave */}
        <svg className="position-absolute bottom-0 w-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
          <path fill="#f8f9fa" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>

      {/* Search Section */}
      {/* <div className="container mt-5 mb-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="input-group shadow-sm rounded-pill overflow-hidden">
              <span className="input-group-text bg-white border-0 ps-3">
                <Search size={20} className="text-primary" />
              </span>
              <input
                type="search"
                className="form-control border-0 py-2"
                placeholder="Enter a condition, e.g. common cold"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  className="btn btn-link text-muted border-0"
                  onClick={clearSearch}
                  type="button"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div> */}

      {/* Your Personal Health Portal Section - Image Left + Text Right + Alphabet Tabs */}
      <div className="container my-5">
        <div className="row align-items-center g-4 mb-5">
          {/* <div className="col-md-5 text-center text-md-start">
            <img
              src={logoMedicalLibrary}
              alt="Health portal illustration"
              className="img-fluid rounded-4 shadow-lg"
              style={{ maxHeight: '300px', objectFit: 'contain' }}
            />
          </div> */}
          {/* <div className="col-md-7">
            <h2 className="fw-bold display-6">Your personal health portal</h2>
            <p className="text-muted fs-5 mb-3">Access our symptom assessment 24/7.</p>
            <button className="btn btn-outline-primary rounded-pill px-4">
              Learn more <ChevronRight size={16} className="ms-1" />
            </button>
          </div> */}
        </div>

        {/* Alphabet Tabs - Modern Pills */}
        <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-end border-bottom pb-3 mb-4">
          {alphabet.map(letter => {
            const hasData = !!conditionsData[letter];
            return (
              <button
                key={letter}
                onClick={() => hasData && handleLetterClick(letter)}
                className={`btn btn-sm rounded-pill px-3 transition-all ${
                  selectedLetter === letter
                    ? 'btn-primary shadow-sm'
                    : hasData
                    ? 'btn-outline-secondary bg-white'
                    : 'btn-link disabled text-muted'
                }`}
                disabled={!hasData}
                style={{ minWidth: '42px', fontWeight: 500 }}
              >
                {letter.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Conditions List - Card style */}
        <div className="row">
          <div className="col-12">
            {displayedConditions.length > 0 ? (
              <div className="row g-3">
                {displayedConditions.map((condition, idx) => (
                  <div key={idx} className="col-md-6 col-lg-4">
                    <a
                      href={condition.url}
                      className="text-decoration-none"
                    >
                      <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift transition-all">
                        <div className="card-body d-flex align-items-center">
                          <div className="flex-shrink-0 me-3">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                              <BookOpen size={20} className="text-primary" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="card-title mb-0 fs-6 fw-semibold text-dark">
                              {condition.name}
                            </h5>
                          </div>
                          <ChevronRight size={18} className="text-muted flex-shrink-0" />
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info text-center rounded-4 py-5" role="alert">
                {searchQuery
                  ? `No conditions found for "${searchQuery}" under letter ${selectedLetter.toUpperCase()}.`
                  : `No conditions available for letter ${selectedLetter.toUpperCase()}.`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-white border-top my-5 py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8 text-center text-md-start">
              <p className="fs-4 fw-semibold mb-0">Get started with Ada today</p>
              <p className="text-muted mb-0 mt-1">Download the app and check your symptoms anytime.</p>
            </div>
            <div className="col-md-4 text-center text-md-end mt-3 mt-md-0">
              <a href="#" target="_blank" rel="nofollow noopener noreferrer" className="btn btn-primary btn-lg rounded-pill px-5">
                Download Ada
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="btn btn-primary rounded-circle shadow-lg position-fixed"
          style={{ bottom: '2rem', right: '2rem', width: '48px', height: '48px', zIndex: 1000 }}
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      <Footer />

      {/* Custom CSS for hover effects and transitions */}
      <style>{`
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1) !important;
        }
        .btn-outline-secondary:hover {
          background-color: #f8f9fa;
          border-color: #dee2e6;
        }
        .input-group:focus-within {
          box-shadow: 0 0 0 0.25rem rgba(13,110,253,0.25);
          border-radius: 2rem;
        }
        .rounded-4 {
          border-radius: 1rem !important;
        }
      `}</style>
    </div>
  );
//   return (
//     <div className="bg-light">
//       {/* Top Navbar with User Icon */}
//      <Header/>

//       {/* Hero Section */}
//       <div className="bg-primary text-white py-5">
//         <div className="container py-4">
//           <div className="row justify-content-center">
//             <div className="col-lg-8 text-center">
//               <h1 className="display-4 fw-bold mb-4">Medical Library</h1>
//               <p className="lead mb-4">
//                 The right health information leads to the right health actions. This library is stocked with tips that can help you stay well and facts about medical conditions. Just like Ada, everything you'll learn here is based on our doctors' clinical experience and the latest research.
//               </p>
//               <div className="d-flex justify-content-center gap-3">
//                 <a
//                   href="#"
//                   target="_blank"
//                   rel="nofollow noopener noreferrer"
//                   className="btn btn-dark"
//                 >
//                   App Store
//                 </a>
//                 <a
//                   href="#"
//                   target="_blank"
//                   rel="nofollow noopener noreferrer"
//                   className="btn btn-dark"
//                 >
//                   Google Play
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search Section */}
//       <div className="container mt-4 mb-3">
//         <div className="row justify-content-center">
//           <div className="col-md-8">
//             <div className="input-group">
//               <span className="input-group-text bg-white border-end-0">
//                 <Search size={20} className="text-muted" />
//               </span>
//               <input
//                 type="search"
//                 className="form-control border-start-0 ps-0"
//                 placeholder="Enter a condition, e.g. common cold"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Your Personal Health Portal Section */}
// <div className="container my-5">
//   {/* Row with image left, text right */}
//   <div className="row align-items-center mb-4">
//     {/* Left column: Image */}
//     <div className="col-md-5 text-center text-md-start mb-3 mb-md-0">
//       <img
//         src={logoMedicalLibrary}   // make sure this is imported or defined
//         alt="Health portal illustration"
//         className="img-fluid rounded shadow-sm"
//         style={{ maxHeight: '400px', objectFit: 'contain' }}
//       />
//     </div>
//     {/* Right column: Text */}
//     <div className="col-md-7">
//       <h2 className="fw-bold">Your personal health portal</h2>
//       <p className="text-muted mb-0">Access our symptom assessment 24/7.</p>
//     </div>

//   {/* Alphabet Tabs - remains right-aligned */}
//   <div className="d-flex flex-wrap gap-2 justify-content-end border-bottom pb-2 mb-4">
//     {alphabet.map(letter => {
//       const hasData = !!conditionsData[letter];
//       return (
//         <button
//           key={letter}
//           onClick={() => hasData && handleLetterClick(letter)}
//           className={`btn btn-sm rounded-pill px-3 ${
//             selectedLetter === letter
//               ? 'btn-primary'
//               : hasData
//               ? 'btn-outline-secondary'
//               : 'btn-link disabled text-muted'
//           }`}
//           disabled={!hasData}
//           style={{ minWidth: '42px' }}
//         >
//           {letter.toUpperCase()}
//         </button>
//       );
//     })}
//   </div>

//   {/* Rest of the component (conditions list, etc.) continues here */}
// </div>

//         {/* Conditions List unchanged */}
//         <div className="row">
//           <div className="col-12">
//             {displayedConditions.length > 0 ? (
//               <div className="list-group">
//                 {displayedConditions.map((condition, idx) => (
//                   <a
//                     key={idx}
//                     href={condition.url}
//                     className="list-group-item list-group-item-action py-3"
//                   >
//                     {condition.name}
//                   </a>
//                 ))}
//               </div>
//             ) : (
//               <div className="alert alert-info text-center" role="alert">
//                 {searchQuery
//                   ? `No conditions found for "${searchQuery}" under letter ${selectedLetter.toUpperCase()}.`
//                   : `No conditions available for letter ${selectedLetter.toUpperCase()}.`}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="bg-white border-top my-5 py-4">
//         <div className="container">
//           <div className="row align-items-center">
//             <div className="col-md-8 text-center text-md-start">
//               <p className="fs-5 fw-semibold mb-0">Get started with Ada today</p>
//             </div>
//             <div className="col-md-4 text-center text-md-end mt-3 mt-md-0">
//               <a
//                 href="#"
//                 target="_blank"
//                 rel="nofollow noopener noreferrer"
//                 className="btn btn-primary px-4"
//               >
//                 Download Ada
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer/>
//     </div>
//   );
};

export default MedicalLibrary;