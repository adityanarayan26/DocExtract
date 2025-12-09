# 📄 DocExtract: AI-Powered Document Intelligence

**Welcome to DocExtract!**

This isn't just a file uploader; it's a smart document assistant built with **Next.js 15**. I designed this application to solve a common problem: efficiently managing and extracting text from locked-away PDF and DOCX files.

Whether you're archiving old contracts or analyzing resumes, DocExtract handles the heavy lifting—securely uploading your files, processing them with AI, and serving the text back to you in a clean, modern dashboard.

---

## 🚀 Why I Built This (And What It Does)

I wanted to create a seamless bridge between raw file storage and usable text data. Here is what makes it tick:

* **Zero-Friction Login:** No passwords to remember. Just sign in with your **Google** account via Supabase Auth.
* **Smart Uploads:** Drag and drop your PDFs or Word docs (up to 10MB). The app automatically validates them before they even hit the server.
* **AI Under the Hood:** As soon as a file lands, a background worker triggers **LangChain** to parse the content—no matter how complex the formatting—and saves the raw text to the database.
* **Privacy First:** Your files aren't just in a public bucket. I implemented strict **Row Level Security (RLS)**, so you (and only you) can see your documents.
* **A "Joy to Use" UI:** Built with **Tailwind CSS** and **GSAP**, the dashboard feels alive with smooth entrance animations and instant feedback.

---

## 🛠️ The Tech Stack

I chose these tools for their performance and developer experience:

* **Frontend:** Next.js 15 (App Router) & TypeScript
* **Styling:** Tailwind CSS + Shadcn UI concepts (Clean & Accessible)
* **Animations:** GSAP (GreenSock) for that premium "feel"
* **Backend & Auth:** Supabase (The open-source Firebase alternative)
* **AI Processing:** LangChain (using `pdf-parse` and `mammoth`)

---

## ⚡ Quick Start Guide

Want to run this locally? Here is your step-by-step guide to getting up and running in under 5 minutes.

### 1. Clone the Repo
First, let's get the code on your machine.

```bash
git clone <your-repo-url>
cd doc-extract