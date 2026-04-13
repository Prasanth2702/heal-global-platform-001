import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Twitter, Facebook, Linkedin, Link2, Check, ChevronRight, Share2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/pages/alldetails/Header';
import Footer from '@/pages/alldetails/Footer';
import { Button } from '../ui/button';

// ==================== TYPES ====================
interface FAQ {
  question: string;
  answer: string;
}

interface Section {
  id: string;
  title: string;
  content: string;
}

interface ConditionDetails {
  slug: string;
  title: string;
  description: string;
  sections: Section[];
  faqs: FAQ[];
}

// ==================== MOCK JSON DATA ====================
// In a real app, this would come from an API or a JSON file import
const CONDITIONS_DB: Record<string, ConditionDetails> = {
'al-amyloidosis': {
  slug: 'al-amyloidosis',
  title: 'AL Amyloidosis',
  description:
    'AL Amyloidosis is a rare condition where abnormal proteins build up in organs like the heart, kidneys, liver, and nerves, affecting how they work.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'AL Amyloidosis occurs when abnormal proteins called amyloid build up in organs and tissues. These protein deposits can damage organs and affect their normal function. Commonly affected organs include the heart, kidneys, liver, digestive system, and nerves. Early diagnosis and treatment are important to prevent serious complications.',
    },

    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Symptoms depend on which organs are affected. Common symptoms include fatigue, swelling in legs or ankles, shortness of breath, weight loss, numbness or tingling in hands and feet, enlarged tongue, irregular heartbeat, and kidney problems. Some patients may also experience dizziness or fainting.',
    },

    {
      id: 'causes',
      title: 'Causes',
      content:
        'AL Amyloidosis happens when bone marrow produces abnormal light-chain proteins. These proteins misfold and form amyloid deposits in organs. It is sometimes associated with plasma cell disorders such as multiple myeloma.',
    },

    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Treatment focuses on stopping abnormal protein production and protecting affected organs. Options may include chemotherapy medications, targeted therapy, stem cell transplant, and supportive treatments for organ symptoms. Treatment depends on the patient’s overall health and organ involvement.',
    },

    {
      id: 'when-to-see-doctor',
      title: 'When to See a Doctor',
      content:
        'Seek medical care if you experience unexplained swelling, fatigue, shortness of breath, weight loss, or numbness in hands and feet. Early diagnosis improves treatment outcomes.',
    },
  ],

  faqs: [
    {
      question: 'Is AL Amyloidosis serious?',
      answer:
        'Yes. AL Amyloidosis can be serious if untreated because it can damage important organs like the heart and kidneys. Early treatment improves outcomes.',
    },
    {
      question: 'Is AL Amyloidosis cancer?',
      answer:
        'AL Amyloidosis is not exactly cancer, but it is related to abnormal plasma cells in the bone marrow, similar to some blood cancers.',
    },
    {
      question: 'Can AL Amyloidosis be cured?',
      answer:
        'There is no complete cure in many cases, but treatment can control the disease and improve quality of life.',
    },
    {
      question: 'Who is at risk?',
      answer:
        'It is more common in people over age 50 and those with plasma cell disorders.',
    },
    {
      question: 'How is AL Amyloidosis diagnosed?',
      answer:
        'Doctors use blood tests, urine tests, imaging scans, and sometimes biopsy to confirm diagnosis.',
    },
  ],
},

'abdominal-pain': {
  slug: 'abdominal-pain',
  title: 'Abdominal Pain',
  description:
    'Abdominal pain refers to discomfort or pain in the stomach area. It can be caused by digestive issues, infections, or more serious medical conditions.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Abdominal pain is one of the most common medical complaints. It can range from mild discomfort to severe pain. Causes vary from indigestion and gas to infections, ulcers, kidney stones, or appendicitis. The location, severity, and duration help doctors determine the cause.',
    },

    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Common symptoms include stomach cramps, bloating, nausea, vomiting, diarrhea, constipation, fever, and loss of appetite. Some people may also experience sharp or dull pain in specific areas of the abdomen.',
    },

    {
      id: 'causes',
      title: 'Common Causes',
      content:
        'Common causes include indigestion, gas, food poisoning, stomach infection, constipation, ulcers, gallstones, kidney stones, appendicitis, and menstrual pain.',
    },

    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Treatment depends on the cause. Mild pain may improve with rest, hydration, and simple medications. Serious conditions may require antibiotics, hospital care, or surgery.',
    },

    {
      id: 'when-to-see-doctor',
      title: 'When to See a Doctor',
      content:
        'Seek immediate medical care if you have severe pain, persistent vomiting, high fever, blood in stool, difficulty breathing, or sudden sharp pain.',
    },
  ],

  faqs: [
    {
      question: 'When is abdominal pain serious?',
      answer:
        'Abdominal pain is serious if it is severe, sudden, persistent, or accompanied by fever, vomiting, or blood in stool.',
    },
    {
      question: 'Can stress cause abdominal pain?',
      answer:
        'Yes. Stress and anxiety can affect digestion and cause stomach pain or cramps.',
    },
    {
      question: 'What helps mild abdominal pain?',
      answer:
        'Rest, drinking fluids, eating light food, and avoiding spicy or fatty foods may help.',
    },
    {
      question: 'Should I take painkillers for abdominal pain?',
      answer:
        'Mild painkillers may help, but avoid taking medication without knowing the cause. Consult a doctor if pain continues.',
    },
    {
      question: 'How long should abdominal pain last?',
      answer:
        'Mild abdominal pain usually improves within a few hours to one day. If pain lasts longer, consult a doctor.',
    },
  ],
},
'achilles-tendonitis': {
  slug: 'achilles-tendonitis',
  title: 'Achilles Tendonitis',
  description:
    'Achilles tendonitis is inflammation of the Achilles tendon, causing pain and stiffness at the back of the ankle.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Achilles tendonitis occurs when the Achilles tendon becomes inflamed due to overuse, injury, or sudden increase in activity. It is common in runners and athletes.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Heel pain, stiffness, swelling near heel, pain after exercise, difficulty walking.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Overuse, sudden increase in exercise, tight calf muscles, improper footwear.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Rest, ice, pain relievers, physiotherapy, supportive footwear.',
    },
  ],

  faqs: [
    {
      question: 'Is Achilles tendonitis serious?',
      answer: 'It can become serious if untreated and may lead to tendon rupture.',
    },
  ],
},

'acne-vulgaris': {
  slug: 'acne-vulgaris',
  title: 'Acne Vulgaris',
  description:
    'Acne vulgaris is a common skin condition that causes pimples, blackheads, and whiteheads.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Acne occurs when hair follicles become clogged with oil and dead skin cells.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Pimples, blackheads, whiteheads, oily skin.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Hormonal changes, bacteria, oily skin, genetics.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Topical creams, antibiotics, skincare routine.',
    },
  ],

  faqs: [
    {
      question: 'Is acne common?',
      answer: 'Yes, acne is very common especially in teenagers.',
    },
  ],
},

'acute-appendicitis': {
  slug: 'acute-appendicitis',
  title: 'Acute Appendicitis',
  description:
    'Acute appendicitis is inflammation of the appendix causing severe abdominal pain.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Appendicitis is a medical emergency requiring immediate treatment.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Right lower abdominal pain, fever, nausea, vomiting.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Blockage in appendix, infection.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Surgery to remove appendix.',
    },
  ],

  faqs: [
    {
      question: 'Is appendicitis emergency?',
      answer: 'Yes, appendicitis requires immediate medical attention.',
    },
  ],
},

'acute-bronchitis': {
  slug: 'acute-bronchitis',
  title: 'Acute Bronchitis',
  description:
    'Acute bronchitis is inflammation of the bronchial tubes that causes coughing and breathing discomfort.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Acute bronchitis usually develops after a cold or respiratory infection. It causes irritation in the airways leading to cough and mucus production.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Cough, mucus production, fatigue, shortness of breath, mild fever.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Viral infections, smoking, air pollution, respiratory infections.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Rest, fluids, cough medication, and sometimes inhalers.',
    },
  ],

  faqs: [
    {
      question: 'How long does acute bronchitis last?',
      answer:
        'Most cases improve within one to three weeks.',
    },
  ],
},

'acute-gastritis': {
  slug: 'acute-gastritis',
  title: 'Acute Gastritis',
  description:
    'Acute gastritis is sudden inflammation of the stomach lining causing pain and discomfort.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Acute gastritis occurs when the stomach lining becomes inflamed due to infection, medication, or alcohol.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Stomach pain, nausea, vomiting, bloating, indigestion.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Alcohol, NSAIDs, infection, stress.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Antacids, acid blockers, diet changes.',
    },
  ],

  faqs: [
    {
      question: 'Is acute gastritis serious?',
      answer:
        'Usually mild but may need treatment if symptoms persist.',
    },
  ],
},

'acute-hiv-infection': {
  slug: 'acute-hiv-infection',
  title: 'Acute HIV Infection',
  description:
    'Acute HIV infection is the early stage of HIV infection occurring shortly after exposure.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'This stage occurs 2–4 weeks after exposure and may resemble flu-like symptoms.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Fever, sore throat, rash, fatigue, swollen glands.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'HIV virus infection through blood, sexual contact, or needles.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Antiretroviral therapy (ART).',
    },
  ],

  faqs: [
    {
      question: 'Is early treatment important?',
      answer:
        'Yes, early treatment improves long-term outcomes.',
    },
  ],
},

'acute-heart-failure': {
  slug: 'acute-heart-failure',
  title: 'Acute Heart Failure',
  description:
    'Acute heart failure occurs when the heart suddenly cannot pump blood effectively.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'This is a medical emergency requiring immediate treatment.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Shortness of breath, swelling, fatigue, chest discomfort.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Heart attack, high blood pressure, heart disease.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Hospital treatment, medications, oxygen.',
    },
  ],

  faqs: [
    {
      question: 'Is acute heart failure emergency?',
      answer:
        'Yes, immediate medical care is needed.',
    },
  ],
},

'acute-laryngitis': {
  slug: 'acute-laryngitis',
  title: 'Acute Laryngitis',
  description:
    'Acute laryngitis is inflammation of the voice box causing hoarseness.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Often caused by viral infection or voice overuse.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Hoarse voice, sore throat, dry cough.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Virus, voice strain, irritation.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Voice rest, fluids, steam inhalation.',
    },
  ],

  faqs: [
    {
      question: 'How long does laryngitis last?',
      answer:
        'Usually 1–2 weeks.',
    },
  ],
},

'acute-otitis-media': {
  slug: 'acute-otitis-media',
  title: 'Acute Otitis Media',
  description:
    'Acute otitis media is a middle ear infection commonly seen in children.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Middle ear infection causes pain and fever.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Ear pain, fever, irritability, hearing problems.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Bacterial or viral infection.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Pain relievers, antibiotics if needed.',
    },
  ],

  faqs: [
    {
      question: 'Is ear infection common?',
      answer:
        'Yes, especially in children.',
    },
  ],
},
'acute-pancreatitis': {
  slug: 'acute-pancreatitis',
  title: 'Acute Pancreatitis',
  description:
    'Acute pancreatitis is sudden inflammation of the pancreas that causes severe abdominal pain and digestive problems.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Acute pancreatitis occurs when digestive enzymes attack the pancreas. It can range from mild discomfort to severe life-threatening illness.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Severe upper abdominal pain, nausea, vomiting, fever, rapid pulse.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Gallstones, alcohol use, infection, medications.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Hospital care, IV fluids, pain relief, treating underlying cause.',
    },
  ],

  faqs: [
    {
      question: 'Is acute pancreatitis serious?',
      answer:
        'Yes, severe cases require emergency treatment.',
    },
  ],
},

'acute-panic-attack': {
  slug: 'acute-panic-attack',
  title: 'Acute Panic Attack',
  description:
    'Acute panic attack is sudden intense fear with physical symptoms like rapid heartbeat and shortness of breath.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Panic attacks occur suddenly and may last several minutes.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Rapid heartbeat, sweating, trembling, shortness of breath.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Stress, anxiety disorders, trauma.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Relaxation techniques, therapy, medication.',
    },
  ],

  faqs: [
    {
      question: 'Are panic attacks dangerous?',
      answer:
        'They are not life-threatening but can be frightening.',
    },
  ],
},

'acute-pharyngitis': {
  slug: 'acute-pharyngitis',
  title: 'Acute Pharyngitis',
  description:
    'Acute pharyngitis is inflammation of the throat causing sore throat and discomfort.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Commonly caused by viral or bacterial infection.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Sore throat, fever, difficulty swallowing.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Virus, bacteria, allergies.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Rest, fluids, medication.',
    },
  ],

  faqs: [
    {
      question: 'Is pharyngitis contagious?',
      answer:
        'Yes, depending on the cause.',
    },
  ],
},

'acute-pyelonephritis': {
  slug: 'acute-pyelonephritis',
  title: 'Acute Pyelonephritis',
  description:
    'Acute pyelonephritis is a kidney infection that requires medical treatment.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Kidney infection caused by bacteria spreading from urinary tract.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Fever, back pain, painful urination.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Bacterial infection.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Antibiotics and hydration.',
    },
  ],

  faqs: [
    {
      question: 'Is kidney infection serious?',
      answer:
        'Yes, requires medical treatment.',
    },
  ],
},

'acute-stress-disorder': {
  slug: 'acute-stress-disorder',
  title: 'Acute Stress Disorder',
  description:
    'Acute stress disorder develops after traumatic events causing anxiety and emotional distress.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Occurs after traumatic events such as accidents or disasters.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Anxiety, flashbacks, sleep problems.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Traumatic events.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Therapy, counseling.',
    },
  ],

  faqs: [
    {
      question: 'Can acute stress disorder become PTSD?',
      answer:
        'Yes, without treatment.',
    },
  ],
},

'acute-varicella-zoster': {
  slug: 'acute-varicella-zoster',
  title: 'Acute Varicella Zoster (Chickenpox)',
  description:
    'Chickenpox is a viral infection causing itchy rash and fever.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Highly contagious viral infection.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Rash, fever, fatigue.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Varicella-zoster virus.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Rest, medication.',
    },
  ],

  faqs: [
    {
      question: 'Is chickenpox contagious?',
      answer:
        'Yes, very contagious.',
    },
  ],
},

'adjustment-disorder': {
  slug: 'adjustment-disorder',
  title: 'Adjustment Disorder',
  description:
    'Adjustment disorder is a stress-related condition where emotional or behavioral symptoms occur after a stressful life event.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Adjustment disorder develops in response to stressful events such as job loss, illness, or relationship problems.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Sadness, anxiety, difficulty concentrating, sleep problems.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Life changes, stress, emotional trauma.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Counseling, therapy, stress management.',
    },
  ],

  faqs: [
    {
      question: 'Is adjustment disorder temporary?',
      answer:
        'Yes, symptoms usually improve with time and treatment.',
    },
  ],
},

'adult-onset-stills-disease': {
  slug: 'adult-onset-stills-disease',
  title: "Adult-onset Still's Disease (AOSD)",
  description:
    'Adult-onset Still’s disease is a rare inflammatory condition causing fever, rash, and joint pain.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'A rare inflammatory disorder affecting adults.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'High fever, rash, joint pain.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Unknown, possibly immune system related.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Anti-inflammatory medications and immune therapy.',
    },
  ],

  faqs: [
    {
      question: 'Is AOSD chronic?',
      answer:
        'It may be chronic in some patients.',
    },
  ],
},

'alcohol-intoxication': {
  slug: 'alcohol-intoxication',
  title: 'Alcohol Intoxication',
  description:
    'Alcohol intoxication occurs when high levels of alcohol affect brain function.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Excess alcohol consumption leads to impaired thinking and coordination.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Confusion, vomiting, slow breathing.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Excess alcohol consumption.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Supportive care and monitoring.',
    },
  ],

  faqs: [
    {
      question: 'Is alcohol intoxication dangerous?',
      answer:
        'Yes, severe cases can be life-threatening.',
    },
  ],
},

'alcohol-withdrawal': {
  slug: 'alcohol-withdrawal',
  title: 'Alcohol Withdrawal',
  description:
    'Alcohol withdrawal occurs when a person suddenly stops heavy alcohol use.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Withdrawal symptoms occur within hours to days.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Tremors, anxiety, sweating, seizures.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Stopping heavy alcohol use.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Medical supervision and medication.',
    },
  ],

  faqs: [
    {
      question: 'Is alcohol withdrawal dangerous?',
      answer:
        'Yes, medical supervision is recommended.',
    },
  ],
},

'allergic-conjunctivitis': {
  slug: 'allergic-conjunctivitis',
  title: 'Allergic Conjunctivitis',
  description:
    'Allergic conjunctivitis is eye inflammation caused by allergens.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Common eye allergy condition.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Red eyes, itching, watering.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Dust, pollen, pet dander.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Antihistamines and eye drops.',
    },
  ],

  faqs: [
    {
      question: 'Is allergic conjunctivitis contagious?',
      answer:
        'No, it is not contagious.',
    },
  ],
},

'allergic-rhinitis': {
  slug: 'allergic-rhinitis',
  title: 'Allergic Rhinitis',
  description:
    'Allergic rhinitis is an allergic reaction causing sneezing and runny nose.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Common allergy affecting nasal passages.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Sneezing, runny nose, congestion.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Pollen, dust, mold.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Antihistamines and nasal sprays.',
    },
  ],

  faqs: [
    {
      question: 'Is allergic rhinitis seasonal?',
      answer:
        'Yes, often seasonal.',
    },
  ],
},

'alzheimers-disease': {
  slug: 'alzheimers-disease',
  title: 'Alzheimer’s Disease',
  description:
    'Alzheimer’s disease is a progressive brain disorder that affects memory, thinking, and behavior.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Alzheimer’s disease gradually destroys memory and thinking skills. It is the most common cause of dementia.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Memory loss, confusion, difficulty speaking, mood changes.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Brain cell damage, genetics, aging.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Medication and supportive care.',
    },
  ],

  faqs: [
    {
      question: 'Is Alzheimer’s curable?',
      answer:
        'No cure exists, but treatment may slow progression.',
    },
  ],
},

'amyotrophic-lateral-sclerosis': {
  slug: 'amyotrophic-lateral-sclerosis',
  title: 'Amyotrophic Lateral Sclerosis (ALS)',
  description:
    'ALS is a nervous system disease that weakens muscles and affects physical function.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'ALS causes progressive muscle weakness.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Muscle weakness, difficulty speaking, trouble breathing.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Unknown, genetic factors.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Supportive therapy and medications.',
    },
  ],

  faqs: [
    {
      question: 'Is ALS fatal?',
      answer:
        'ALS is a serious progressive disease.',
    },
  ],
},

'anal-cancer': {
  slug: 'anal-cancer',
  title: 'Anal Cancer',
  description:
    'Anal cancer is a rare cancer that develops in the anal canal.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Anal cancer affects tissues of the anus.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Bleeding, pain, lumps.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'HPV infection, smoking.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Radiation, chemotherapy, surgery.',
    },
  ],

  faqs: [
    {
      question: 'Is anal cancer treatable?',
      answer:
        'Yes, early treatment improves outcomes.',
    },
  ],
},

'anal-fissure': {
  slug: 'anal-fissure',
  title: 'Anal Fissure',
  description:
    'Anal fissure is a small tear in the lining of the anus causing pain.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Common cause of pain during bowel movements.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Pain, bleeding, itching.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Constipation, hard stool.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Diet changes, medications.',
    },
  ],

  faqs: [
    {
      question: 'Do fissures heal naturally?',
      answer:
        'Most heal with conservative treatment.',
    },
  ],
},

'anaphylaxis': {
  slug: 'anaphylaxis',
  title: 'Anaphylaxis',
  description:
    'Anaphylaxis is a severe allergic reaction requiring emergency care.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Life-threatening allergic reaction.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Difficulty breathing, swelling, dizziness.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Food, medication, insect stings.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Emergency epinephrine injection.',
    },
  ],

  faqs: [
    {
      question: 'Is anaphylaxis emergency?',
      answer:
        'Yes, immediate medical care needed.',
    },
  ],
},

'anemia': {
  slug: 'anemia',
  title: 'Anemia',
  description:
    'Anemia occurs when the body lacks enough healthy red blood cells.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Common blood condition affecting oxygen supply.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Fatigue, weakness, pale skin.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Iron deficiency, blood loss.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Iron supplements, diet changes.',
    },
  ],

  faqs: [
    {
      question: 'Is anemia common?',
      answer:
        'Yes, especially in women.',
    },
  ],
},
'aortic-dissection': {
  slug: 'aortic-dissection',
  title: 'Aortic Dissection',
  description:
    'Aortic dissection is a serious condition where the inner layer of the aorta tears, causing life-threatening bleeding.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Aortic dissection is a medical emergency that requires immediate treatment to prevent complications.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Sudden severe chest pain, back pain, shortness of breath.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'High blood pressure, connective tissue disorders.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Emergency surgery or medication.',
    },
  ],

  faqs: [
    {
      question: 'Is aortic dissection fatal?',
      answer:
        'It can be fatal without emergency treatment.',
    },
  ],
},

'aphthous-ulcers': {
  slug: 'aphthous-ulcers',
  title: 'Aphthous Mouth Ulcers',
  description:
    'Aphthous ulcers are small painful sores inside the mouth.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Common mouth ulcers that usually heal within one to two weeks.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Painful sores, difficulty eating.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Stress, injury, vitamin deficiency.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Topical gels, mouthwash.',
    },
  ],

  faqs: [
    {
      question: 'Are mouth ulcers contagious?',
      answer:
        'No, they are not contagious.',
    },
  ],
},

'appendix-pain': {
  slug: 'appendix-pain',
  title: 'Appendix Pain',
  description:
    'Appendix pain may indicate appendicitis and requires medical attention.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Pain usually starts near the belly button and moves to right lower abdomen.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Right abdominal pain, fever, nausea.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Appendix inflammation.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Surgery may be required.',
    },
  ],

  faqs: [
    {
      question: 'Is appendix pain emergency?',
      answer:
        'Yes, immediate medical evaluation is needed.',
    },
  ],
},

'arthritis': {
  slug: 'arthritis',
  title: 'Arthritis',
  description:
    'Arthritis is inflammation of joints causing pain and stiffness.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Common condition affecting joints.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Joint pain, swelling, stiffness.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Aging, autoimmune diseases.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Medication, physiotherapy.',
    },
  ],

  faqs: [
    {
      question: 'Is arthritis permanent?',
      answer:
        'Some types are chronic but manageable.',
    },
  ],
},

'asperger-syndrome': {
  slug: 'asperger-syndrome',
  title: 'Asperger Syndrome',
  description:
    'Asperger syndrome is a developmental condition affecting social interaction and behavior.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Part of autism spectrum disorder.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Social difficulty, repetitive behavior.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Developmental differences.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Therapy and support.',
    },
  ],

  faqs: [
    {
      question: 'Is Asperger lifelong?',
      answer:
        'Yes, but support helps improve skills.',
    },
  ],
},

'asthma': {
  slug: 'asthma',
  title: 'Asthma',
  description:
    'Asthma is a chronic lung disease causing breathing difficulty.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Airway inflammation causes breathing problems.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Wheezing, cough, shortness of breath.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Allergies, triggers.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Inhalers and medication.',
    },
  ],

  faqs: [
    {
      question: 'Is asthma curable?',
      answer:
        'No cure, but manageable.',
    },
  ],
},

'asymptomatic-covid-19': {
  slug: 'asymptomatic-covid-19',
  title: 'Asymptomatic COVID-19',
  description:
    'Asymptomatic COVID-19 occurs when a person is infected with COVID-19 but does not show symptoms.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'People with asymptomatic COVID-19 can still spread the virus even without symptoms.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'No visible symptoms but infection present.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'COVID-19 virus infection.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Isolation, monitoring, supportive care.',
    },
  ],

  faqs: [
    {
      question: 'Can asymptomatic COVID spread?',
      answer:
        'Yes, asymptomatic individuals can spread the virus.',
    },
  ],
},

'ataxia': {
  slug: 'ataxia',
  title: 'Ataxia',
  description:
    'Ataxia is a neurological condition affecting coordination and balance.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Ataxia affects movement and coordination.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Poor coordination, unsteady walking.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Brain damage, genetics.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Therapy and supportive care.',
    },
  ],

  faqs: [
    {
      question: 'Is ataxia permanent?',
      answer:
        'Depends on cause.',
    },
  ],
},

'atherosclerosis': {
  slug: 'atherosclerosis',
  title: 'Atherosclerosis',
  description:
    'Atherosclerosis is narrowing of arteries due to plaque buildup.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Plaque buildup reduces blood flow.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Chest pain, fatigue.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'High cholesterol, smoking.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Lifestyle changes, medication.',
    },
  ],

  faqs: [
    {
      question: 'Is atherosclerosis preventable?',
      answer:
        'Yes with healthy lifestyle.',
    },
  ],
},

'atopic-dermatitis': {
  slug: 'atopic-dermatitis',
  title: 'Atopic Dermatitis',
  description:
    'Atopic dermatitis is a chronic skin condition causing itchy inflammation.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Common type of eczema.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Dry itchy skin.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Genetics, immune response.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Moisturizers and medication.',
    },
  ],

  faqs: [
    {
      question: 'Is eczema contagious?',
      answer:
        'No, eczema is not contagious.',
    },
  ],
},

'atrial-fibrillation-afib': {
  slug: 'atrial-fibrillation-afib',
  title: 'Atrial fibrillation (AFib)',
  description:
    'Atrial fibrillation is an irregular heartbeat condition.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'AFib increases stroke risk.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Irregular heartbeat, fatigue.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Heart disease, high blood pressure.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Medication, procedures.',
    },
  ],

  faqs: [
    {
      question: 'Is AFib serious?',
      answer:
        'Yes, requires monitoring.',
    },
  ],
},

'attention-deficit-hyperactivity-disorder': {
  slug: 'attention-deficit-hyperactivity-disorder',
  title: 'Attention Deficit Hyperactivity Disorder (ADHD)',
  description:
    'ADHD is a condition affecting attention and behavior.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Common neurodevelopmental disorder.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Inattention, hyperactivity.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Genetics, brain differences.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Behavior therapy, medication.',
    },
  ],

  faqs: [
    {
      question: 'Is ADHD lifelong?',
      answer:
        'Some symptoms continue into adulthood.',
    },
  ],
},

'autism': {
  slug: 'autism',
  title: 'Autism',
  description:
    'Autism is a developmental condition affecting communication and behavior.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Autism spectrum disorder varies in severity.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Communication difficulty, repetitive behavior.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Genetic and developmental factors.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Therapy and support.',
    },
  ],

  faqs: [
    {
      question: 'Can autism be cured?',
      answer:
        'No cure but support improves outcomes.',
    },
  ],
},

'avian-influenza-virus': {
  slug: 'avian-influenza-virus',
  title: 'Avian influenza (bird flu)',
  description:
    'Avian influenza is a viral infection spread from birds to humans.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Rare but serious infection.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Fever, cough, breathing problems.',
    },
    {
      id: 'causes',
      title: 'Causes',
      content:
        'Bird flu virus.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Antiviral medication.',
    },
  ],

  faqs: [
    {
      question: 'Is bird flu dangerous?',
      answer:
        'Yes, severe cases possible.',
    },
  ],
},
'acute-aspiration-of-e-or-gastric-contents': {
  slug: 'acute-aspiration-of-e-or-gastric-contents',
  title: 'Acute Aspiration of Oropharyngeal or Gastric Contents',
  description:
    'Acute aspiration occurs when food, liquid, or stomach contents enter the lungs causing breathing difficulty and infection.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Aspiration occurs when substances enter the airway instead of the stomach. This can lead to lung irritation, infection, or aspiration pneumonia.',
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      content:
        'Symptoms include coughing, breathing difficulty, chest pain, fever, and choking sensation.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Treatment may include oxygen therapy, antibiotics, and supportive care depending on severity.',
    }
  ],

  faqs: [
    {
      question: 'Is aspiration dangerous?',
      answer: 'Yes, aspiration can lead to pneumonia and serious lung infection.'
    }
  ]
},
'antiviral-medication': {
  slug: 'antiviral-medication',
  title: 'Antiviral for COVID-19',
  description:
    'Antiviral medications help reduce severity of COVID-19 infection and speed recovery.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Antiviral medications are used to treat COVID-19 infection and reduce complications.',
    },
    {
      id: 'symptoms',
      title: 'Who Needs It',
      content:
        'People at high risk including elderly, diabetes, heart disease, and lung disease.',
    },
    {
      id: 'treatment',
      title: 'Treatment',
      content:
        'Doctors prescribe antiviral medicines based on symptoms and risk factors.',
    }
  ],

  faqs: [
    {
      question: 'Do antivirals cure COVID?',
      answer: 'Antivirals help reduce severity but do not fully cure infection.'
    }
  ]
},'at-home-testosterone-test': {
  slug: 'at-home-testosterone-test',
  title: 'At-home Testosterone Test',
  description:
    'At-home testosterone tests allow individuals to check hormone levels using home kits.',

  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content:
        'Testosterone testing helps evaluate hormone levels affecting energy, mood, and health.',
    },
    {
      id: 'symptoms',
      title: 'When Needed',
      content:
        'Low energy, fatigue, low libido, and muscle weakness.',
    },
    {
      id: 'treatment',
      title: 'Next Steps',
      content:
        'Consult doctor after testing for treatment guidance.',
    }
  ],

  faqs: [
    {
      question: 'Is home testosterone test accurate?',
      answer: 'Most kits are reliable but doctor confirmation is recommended.'
    }
  ]
},
};


const Conditions: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [condition, setCondition] = useState<ConditionDetails | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

const toggleFaq = (index: number) => {
  setOpenFaqs(prev => ({ ...prev, [index]: !prev[index] }));
};
  // Load condition data
  useEffect(() => {
    if (slug && CONDITIONS_DB[slug]) {
      setCondition(CONDITIONS_DB[slug]);
    } else if (slug) {
      navigate('/library', { replace: true });
    }
  }, [slug, navigate]);

  // Scroll spy
  useEffect(() => {
    if (!condition) return;
    const sections = condition.sections.map(s => s.id);
    if (condition.faqs.length) sections.push('faq');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -30% 0px' }
    );
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [condition]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(condition?.title || 'Medical Condition');
    let shareLink = '';
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${title}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${title}`;
        break;
      default:
        return;
    }
    window.open(shareLink, '_blank', 'noopener,noreferrer,width=600,height=450');
  };

  if (!condition) {
    return (
      <div className="bg-light min-vh-100">
        <Header />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-light">
      <Header />

      {/* Back button */}
      <div className="container mt-4 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="rounded-pill shadow-sm"
        >
          ← Back
        </Button>
      </div>

      {/* Hero Section - Gradient with modern wave */}
      <div className="position-relative text-white" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
        <div className="container py-5">
          <h1 className="display-4 fw-bold">{condition.title}</h1>
          <p className="lead mt-3 fs-4">{condition.description}</p>
        </div>
        <svg className="position-absolute bottom-0 w-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80">
          <path fill="#f8f9fa" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>

      {/* Main content */}
      <div className="container my-5">
        <div className="row g-5">
          {/* Left column */}
          <div className="col-lg-8" ref={contentRef}>
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-4 p-xl-5">
                {condition.sections.map(section => (
                  <section key={section.id} id={section.id} className="mb-5 scroll-mt-5">
                    <h2 className="h3 fw-bold mb-4 pb-2  d-inline-block">
                      {section.title}
                    </h2>
                    <div className="text-secondary lh-lg fs-6">
                      {section.content.split('\n').map((para, i) => (
                        <p key={i} className="mb-3">{para}</p>
                      ))}
                    </div>
                  </section>
                ))}

                {/* FAQ Section */}
                {/* {condition.faqs.length > 0 && (
                  <section id="faq" className="mt-5 pt-4 scroll-mt-5">
                    <h2 className="h3 fw-bold mb-4 pb-2  d-inline-block">
                      Frequently Asked Questions
                    </h2>
                    <div className="accordion mt-4" id={`faqAccordion-${condition.slug}`}>
                      {condition.faqs.map((faq, idx) => {
                        const collapseId = `faq-collapse-${condition.slug}-${idx}`;
                        const headingId = `faq-heading-${condition.slug}-${idx}`;
                        return (
                          <div className="accordion-item border-0 shadow-sm mb-3 rounded-3" key={idx}>
                            <h3 className="accordion-header" id={headingId}>
                              <button
                                className="accordion-button collapsed rounded-3 bg-light fw-semibold"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#${collapseId}`}
                                aria-expanded="false"
                                aria-controls={collapseId}
                              >
                                {faq.question}
                              </button>
                            </h3>
                            <div
                              id={collapseId}
                              className="accordion-collapse collapse"
                              aria-labelledby={headingId}
                              data-bs-parent={`#faqAccordion-${condition.slug}`}
                            >
                              <div className="accordion-body text-secondary">
                                {faq.answer}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )} */}
                {condition.faqs.length > 0 && (
  <section id="faq" className="mt-5 pt-4 scroll-mt-5">
    <h2 className="h3 fw-bold mb-4 pb-2 d-inline-block">
      Frequently Asked Questions
    </h2>
    <div className="mt-4">
      {condition.faqs.map((faq, idx) => (
        <div className="card border-0 shadow-sm mb-3 rounded-3" key={idx}>
         <button
  className="btn btn-link text-start text-decoration-none w-100 p-3 bg-light rounded-3 d-flex justify-content-between align-items-center"
  onClick={() => toggleFaq(idx)}
  aria-expanded={openFaqs[idx] || false}
>
  <span className="fw-semibold">{faq.question}</span>
  <span className="ms-2">
    {openFaqs[idx] ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
  </span>
</button>
          {openFaqs[idx] && (
            <div className="card-body pt-0 pb-3 px-3 text-secondary">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
)}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-lg-4">
            <div className="position-sticky" style={{ top: '2rem' }}>
              {/* Table of Contents */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold mb-3">
                    <span className="ps-3">On this page</span>
                  </h5>
                  <nav className="nav flex-column gap-1">
                    {condition.sections.map(section => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`d-flex align-items-center gap-2 btn btn-link text-start text-decoration-none p-2 rounded-3 transition-all ${
                          activeSection === section.id
                            ? 'bg-primary bg-opacity-10 text-primary fw-semibold'
                            : 'text-muted hover-bg-light'
                        }`}
                        style={{ fontSize: '0.9rem' }}
                      >
                        <ChevronRight size={14} className={activeSection === section.id ? 'opacity-100' : 'opacity-0'} />
                        {section.title}
                      </button>
                    ))}
                    {condition.faqs.length > 0 && (
                      <button
                        onClick={() => scrollToSection('faq')}
                        className={`d-flex align-items-center gap-2 btn btn-link text-start text-decoration-none p-2 rounded-3 transition-all ${
                          activeSection === 'faq'
                            ? 'bg-primary bg-opacity-10 text-primary fw-semibold'
                            : 'text-muted hover-bg-light'
                        }`}
                        style={{ fontSize: '0.9rem' }}
                      >
                        <ChevronRight size={14} className={activeSection === 'faq' ? 'opacity-100' : 'opacity-0'} />
                        FAQs
                      </button>
                    )}
                  </nav>
                </div>
              </div>

              {/* Social Share */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold mb-3 d-flex align-items-center gap-2">
                    <Share2 size={18} /> Share this article
                  </h5>
                  <div className="d-flex gap-3 justify-content-between">
                    <button
                      onClick={() => openShare('twitter')}
                      className="btn btn-outline-secondary rounded-circle p-2 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                      style={{ maxWidth: '60px' }}
                      aria-label="Share on Twitter"
                    >
                      <Twitter size={18} />
                    </button>
                    <button
                      onClick={() => openShare('facebook')}
                      className="btn btn-outline-secondary rounded-circle p-2 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                      style={{ maxWidth: '60px' }}
                      aria-label="Share on Facebook"
                    >
                      <Facebook size={18} />
                    </button>
                    <button
                      onClick={() => openShare('linkedin')}
                      className="btn btn-outline-secondary rounded-circle p-2 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                      style={{ maxWidth: '60px' }}
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin size={18} />
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="btn btn-outline-secondary rounded-circle p-2 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                      style={{ maxWidth: '60px' }}
                      aria-label="Copy link"
                    >
                      {copySuccess ? <Check size={18} className="text-success" /> : <Link2 size={18} />}
                    </button>
                  </div>
                  {copySuccess && (
                    <div className="mt-3 text-center small text-success bg-success bg-opacity-10 rounded-3 py-1">
                      Link copied!
                    </div>
                  )}
                </div>
              </div>

              {/* Optional: CTA card */}
              <div className="card border-0 bg-primary bg-opacity-10 rounded-4 mt-4">
                <div className="card-body p-4 text-center">
                  <BookOpen size={32} className="text-primary mb-2" />
                  <h6 className="fw-bold">Still have questions?</h6>
                  <p className="small text-muted">Consult our symptom checker for personalized guidance.</p>
                  <button className="btn btn-primary btn-sm rounded-pill px-4">Try now →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Custom CSS for smooth transitions and scroll margin */}
      <style>{`
        .scroll-mt-5 {
          scroll-margin-top: 5rem;
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
        .hover-bg-light:hover {
          background-color: #f8f9fa;
        }
        .rounded-4 {
          border-radius: 1rem !important;
        }
        .rounded-5 {
          border-radius: 1.25rem !important;
        }
        .accordion-button:not(.collapsed) {
          background-color: #e7f1ff;
          color: #0d6efd;
          box-shadow: none;
        }
        .accordion-button:focus {
          box-shadow: none;
          border-color: rgba(13,110,253,0.25);
        }
      `}</style>
    </div>
  );
};

export default Conditions;