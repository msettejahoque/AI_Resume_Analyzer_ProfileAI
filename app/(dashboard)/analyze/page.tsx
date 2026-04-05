'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingButton from '@/components/shared/LoadingButton';
import { createClient } from '@/lib/supabase/client';
import AnalysisLoader from '@/components/dashboard/AnalysisLoader';

export default function AnalyzePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [lastResume, setLastResume] = useState<string>('');
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);

  //to let the user use previous resume
  useEffect(() => {
    const fetchLastResume = async (): Promise<void> => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('analyses')
        .select('resume_text')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data?.resume_text) {
        setLastResume(data.resume_text);
      }
    };

    fetchLastResume();
  }, []);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const pdfjsLib = await import('pdfjs-dist');

    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url
    ).toString();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => {
          if (typeof item === 'object' && item !== null && 'str' in item) {
            return (item as { str: string }).str;
          }
          return '';
        })
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    setError('');
    setFileName(file.name);
    setPdfLoading(true);

    try {
      const text = await extractTextFromPDF(file);
      if (!text) {
        setError(
          'Could not extract text from this PDF. Please paste your resume manually.'
        );
        setFileName('');
        return;
      }
      setResumeText(text);
    } catch {
      setError('Failed to read PDF. Please paste your resume manually.');
      setFileName('');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleAnalyze = async (): Promise<void> => {
    setError('');

    if (!resumeText.trim()) {
      setError('Please add your resume — paste text or upload a PDF.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description.');
      return;
    }
    if (resumeText.trim().length < 100) {
      setError('Resume text seems too short. Please add more content.');
      return;
    }
    if (jobDescription.trim().length < 50) {
      setError('Job description seems too short. Please add more content.');
      return;
    }

    // in handleAnalyze:

    // exact match check
    if (resumeText.trim() === jobDescription.trim()) {
      setError(
        'Resume and job description are identical. Please check your inputs.'
      );
      return;
    }

    // similarity check
    const words1 = new Set(resumeText.toLowerCase().split(/\s+/));
    const words2 = new Set(jobDescription.toLowerCase().split(/\s+/));
    const intersection = [...words1].filter((w) => words2.has(w));
    const similarity = intersection.length / Math.max(words1.size, words2.size);

    if (similarity > 0.85) {
      setError(
        'Your resume and job description look too similar. Please make sure you pasted the correct content in each field.'
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }
      // call AI via API route
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      if (response.status === 429) {
        setError(
          'Our AI is temporarily busy. Please try again in a few minutes.'
        );
        return;
      }

      if (!response.ok) {
        setError('Analysis failed. Please try again.');
        return;
      }

      const result = await response.json();

      // save to database
      const { data, error: dbError } = await supabase
        .from('analyses')
        .insert({
          user_id: user.id,
          resume_text: resumeText,
          job_description: jobDescription,
          score: result.score,
          strengths: result.strengths,
          gaps: result.gaps,
          requirements: result.requirements,
          ats_keywords: result.ats_keywords,
          recommendations: result.recommendations,
          cover_letter: result.cover_letter,
          company_name: result.company_name,
          application_link: result.application_link,
          contact_email: result.contact_email,
        })
        .select('id')
        .single();

      if (dbError) {
        setError('Failed to save analysis. Please try again.');
        return;
      }

      // redirect to results
      router.push(`/results/${data.id}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AnalysisLoader />;
  }

  return (
    <div className="max-w-215 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-extrabold text-text-primary tracking-[-0.02em] mb-1">
          New Analysis
        </h1>
        <p className="text-sm text-text-secondary">
          Paste your resume and job description to get your AI match score.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="px-4 py-3 hidden md:block lg:block rounded-[10px] mb-6 border border-[rgba(239,68,68,.25)] text-danger-light text-sm"
          style={{ background: 'rgba(239,68,68,.08)' }}
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Resume input */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label className="text-text-primary font-semibold text-[15px]">
              Your Resume
            </Label>
            {lastResume && (
              <button
                onClick={() => {
                  setResumeText(lastResume);
                  setFileName('');
                }}
                className="text-xs text-brand font-medium cursor-pointer bg-transparent border-none hover:opacity-80 transition-opacity"
              >
                ↩ Use last resume
              </button>
            )}
          </div>

          <Tabs defaultValue="paste" className="w-full">
            <TabsList className="bg-bg-elevated border border-border-default w-full mb-3">
              <TabsTrigger
                value="paste"
                className="flex-1 data-[state=active]:bg-bg-card data-[state=active]:text-text-primary text-text-muted"
              >
                Paste Text
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="flex-1 data-[state=active]:bg-bg-card data-[state=active]:text-text-primary text-text-muted"
              >
                Upload PDF
              </TabsTrigger>
            </TabsList>

            <TabsContent value="paste">
              <Textarea
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                disabled={loading}
                className="h-80 bg-bg-input border-border-default text-text-primary placeholder:text-text-muted resize-none focus:border-border-focus overflow-y-auto"
              />
            </TabsContent>

            <TabsContent value="upload">
              <div
                className="min-h-80 rounded-[10px] border-2 border-dashed border-border-default flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-border-focus transition-colors duration-200 px-6"
                onClick={() => fileInputRef.current?.click()}
                style={{ background: 'rgba(59,130,246,.03)' }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {pdfLoading ? (
                  // parsing state
                  <div className="flex flex-col items-center gap-3">
                    <svg
                      className="w-8 h-8 animate-spin text-brand"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-text-primary">
                        Parsing your resume...
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Taking too long? Close and paste your text manually.
                      </p>
                    </div>
                  </div>
                ) : fileName ? (
                  <>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border border-[rgba(59,130,246,.2)]"
                      style={{ background: 'rgba(59,130,246,.1)' }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth={1.8}
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-text-primary">
                        {fileName}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        PDF extracted successfully
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileName('');
                        setResumeText('');
                        if (fileInputRef.current)
                          fileInputRef.current.value = '';
                      }}
                      className="text-xs text-danger-light hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border border-[rgba(59,130,246,.2)]"
                      style={{ background: 'rgba(59,130,246,.08)' }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth={1.8}
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-text-primary">
                        Click to upload PDF
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Max 5MB — text will be extracted automatically
                      </p>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Job description input */}
        <div className="flex flex-col gap-3">
          <Label className="text-text-primary font-semibold text-[15px]">
            Job Description
          </Label>
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={loading}
            className="h-95 bg-bg-input border-border-default text-text-primary placeholder:text-text-muted resize-none focus:border-border-focus overflow-y-auto"
          />
        </div>
      </div>

      {/* Analyze button */}

      {error && (
        <div
          className="px-4 py-3 sm:block md:hidden lg:hidden rounded-[10px] mb-6 border border-[rgba(239,68,68,.25)] text-danger-light text-sm"
          style={{ background: 'rgba(239,68,68,.08)' }}
        >
          {error}
        </div>
      )}
      <div className="flex flex-col items-center gap-3">
        <LoadingButton
          loading={loading}
          onClick={handleAnalyze}
          loadingText="Analyzing your resume..."
          className="w-full md:w-auto md:px-16 py-3 text-base"
        >
          ✦ Analyze My Resume
        </LoadingButton>
        <p className="text-xs text-text-muted">Takes around 10-15 seconds</p>
      </div>
    </div>
  );
}


