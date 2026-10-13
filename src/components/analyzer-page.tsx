"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://clauseguard-q5fk.onrender.com";
const ANALYZE_COOLDOWN_SECONDS = 30;

const sampleContract = [
  "1. Term",
  "This agreement lasts for twelve months.",
  "",
  "2. Termination",
  "Either party may terminate this agreement without notice.",
  "",
  "3. Payment",
  "Client shall pay Provider within thirty days of receiving an invoice.",
].join("\n");

function ShieldIcon({ size = "h-5 w-5" }: { size?: string }) {
  return <Image src="/icon.png" alt="" width={24} height={24} className={size} />;
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path d="M12 16V4m0 0L8 8m4-4 4 4M5 14v4.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path d="M3 10h13m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

export default function AnalyzerPage() {
  const [contractText, setContractText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [processingStage, setProcessingStage] = useState("reading");
  const [isExtracting, setIsExtracting] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const syncCooldown = () => {
      const lastAnalysisAt = Number(window.localStorage.getItem("clauseguard:last-analysis-at"));
      const remaining = Math.ceil((lastAnalysisAt + ANALYZE_COOLDOWN_SECONDS * 1000 - Date.now()) / 1000);
      setCooldownSeconds(Math.max(0, remaining));
    };

    const initialSync = window.setTimeout(syncCooldown, 0);
    const timer = window.setInterval(syncCooldown, 1000);

    return () => {
      window.clearTimeout(initialSync);
      window.clearInterval(timer);
    };
  }, []);


  useEffect(() => {
    if (!isAnalyzing) {
      return;
    }

    const timers = [
      window.setTimeout(() => setProcessingStage("checking"), 1200),
      window.setTimeout(() => setProcessingStage("assessing"), 4200),
      window.setTimeout(() => setProcessingStage("prioritizing"), 9000),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isAnalyzing]);

  const selectFile = async (file?: File) => {
    if (!file) return;

    setFileName(file.name);
    setUploadError("");
    setIsExtracting(true);
    setContractText("");

    try {
      const extension = file.name.toLowerCase().split(".").pop();
      let extractedText = "";

      if (extension === "pdf") {
        type PdfTextPage = {
          getTextContent: () => Promise<{ items: Array<{ str?: string }> }>;
        };
        type PdfDocument = {
          numPages: number;
          getPage: (pageNumber: number) => Promise<PdfTextPage>;
        };
        type PdfModule = {
          GlobalWorkerOptions: { workerSrc: string };
          getDocument: (options: { data: ArrayBuffer; disableAutoFetch: boolean }) => { promise: Promise<PdfDocument> };
        };

        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs") as unknown as PdfModule;
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
        const document = await pdfjs.getDocument({ data: await file.arrayBuffer(), disableAutoFetch: true }).promise;
        const pages: string[] = [];

        for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
          const page = await document.getPage(pageNumber);
          const content = await page.getTextContent();
          pages.push(content.items.map((item) => item.str ?? "").join(" "));
        }

        extractedText = pages.join("\n\n");
      } else if (extension === "docx") {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        extractedText = result.value;
      } else if (extension === "txt") {
        extractedText = await file.text();
      } else {
        throw new Error("Please upload a PDF, DOCX, or TXT file.");
      }

      if (!extractedText.trim()) {
        throw new Error("No readable text was found in this document.");
      }

      setContractText(extractedText.trim());
    } catch (error) {
      setFileName("");
      setUploadError(error instanceof Error ? error.message : "Unable to extract text from this document.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    void selectFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleAnalyze = async () => {
    if (!contractText.trim() || isAnalyzing || cooldownSeconds > 0) return;

    setIsAnalyzing(true);
    setProcessingStage("reading");
    setErrorMessage("");

    try {
      const response = await fetch(API_BASE_URL + "/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract_text: contractText }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const detail = typeof data?.detail === "string" ? data.detail : "The analysis request could not be completed.";
        throw new Error(detail);
      }

      if (!data?.run_id) {
        throw new Error("The analysis completed without a run ID.");
      }

      window.localStorage.setItem("clauseguard:last-analysis-at", String(Date.now()));
      setCooldownSeconds(ANALYZE_COOLDOWN_SECONDS);
      router.push(`/runs/${data.run_id}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to reach the ClauseGuard API.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearContract = () => {
    setContractText("");
    setFileName("");
    setErrorMessage("");
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isAnalyzing) {
    const processingTitle = fileName ? `Processing ${fileName}` : "Processing your contract";
    const activeStageIndex = ["reading", "checking", "assessing", "prioritizing"].indexOf(processingStage);
    const telemetry = [
      "[10:42:01] Parsing contract structure... OK",
      "[10:42:02] Mapping clauses to reference rules...",
      "[10:42:03] Assessing risk and critical liabilities...",
      "[10:42:04] Prioritizing findings and recommendations...",
    ];
    const stages = [
      ["Reading and isolating clauses", "Preserving original alignment constraints and text blocks."],
      ["Checking against typical contract norms", "Comparing terms with the ClauseGuard reference knowledge base."],
      ["Assessing risk and critical liabilities", "Evaluating indemnity, governing law, payment, and termination risks."],
      ["Prioritizing findings and generating recommendations", "Formatting actionable guidance in clear, plain language."],
    ];

    return (
      <main className="min-h-screen bg-canvas text-ink">
        <header className="border-b border-line/80 bg-white">
          <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
            <Link href="/" className="flex items-center gap-3" aria-label="ClauseGuard home">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-ink text-white shadow-sm"><ShieldIcon /></span>
              <span className="text-[19px] font-bold tracking-[-0.04em]">ClauseGuard</span>
              <span className="hidden rounded-md border border-blue/20 bg-blue-pale px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-blue sm:inline-flex">Analyzer</span>
            </Link>
            <nav className="hidden items-center gap-8 text-[14px] text-slate md:flex" aria-label="Main navigation">
              <span className="font-semibold text-ink">New Scan</span>
              <Link className="transition-colors hover:text-ink" href="/saved-contracts">Saved Contracts</Link>
              <span className="ml-1 h-8 w-px bg-line" aria-hidden="true" />
              <span className="rounded-full bg-[#eef2f7] px-3.5 py-2 text-xs font-semibold text-slate">CW</span>
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex items-start gap-3.5 rounded-xl border border-line bg-white px-5 py-4 shadow-card sm:px-6">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff7e7] text-[#bd7b12]" aria-hidden="true">!</span>
            <p className="text-[13px] leading-6 text-slate sm:text-[14px]"><strong className="font-bold tracking-wide text-ink">LEGAL NOTICE:</strong>{" "}ClauseGuard provides an informational first-pass analysis, not professional legal advice, and does not create an attorney-client relationship.</p>
          </div>

          <section className="mt-9" aria-live="polite" aria-labelledby="processing-title">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue">Analysis in progress</p>
            <h1 id="processing-title" className="mt-3 break-words text-[30px] font-bold tracking-[-0.05em] text-ink sm:text-[40px]">{processingTitle}</h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate sm:text-[16px]">Our legal analysis engine is examining clause structure, reference rules, and potential liability thresholds.</p>

            <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,1fr)]">
              <div className="rounded-xl border border-line bg-white p-5 shadow-card sm:p-8">
                <div className="space-y-2">
                  {stages.map(([title, description], index) => {
                    const isComplete = index < activeStageIndex;
                    const isActive = index === activeStageIndex;
                    return (
                      <div key={title} className={["flex items-start gap-4 rounded-lg px-3 py-4 transition-colors sm:px-4", isActive ? "bg-blue-pale" : ""].join(" ")}>
                        <span className={["mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm", isComplete ? "bg-[#e8faf4] text-green" : isActive ? "bg-[#dbe8ff] text-blue" : "border border-line bg-[#f5f7fa] text-transparent"].join(" ")}>
                          {isComplete ? "✓" : isActive ? <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue" /> : "•"}
                        </span>
                        <div className="min-w-0">
                          <p className={["text-[15px] font-semibold", isActive ? "text-[#244a9b]" : isComplete ? "text-ink" : "text-[#8ea2c0]"].join(" ")}>{title}{isActive ? " (Active)" : ""}</p>
                          <p className={["mt-1 text-[12px] leading-5", isActive ? "text-blue" : isComplete ? "text-[#9aacc4]" : "text-[#a8b7cb]"].join(" ")}>{description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <aside className="flex min-h-[360px] flex-col rounded-xl bg-[#101a2e] p-6 text-white shadow-card sm:p-7" aria-label="Diagnostic telemetry">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9aacc4]">Diagnostic telemetry</p>
                <div className="mt-4 space-y-3 font-mono text-[11px] leading-5">
                  {telemetry.map((message, index) => <p key={message} className={index <= activeStageIndex ? index === 2 && activeStageIndex >= 2 ? "text-[#ff6b6b]" : "text-[#00c995]" : "text-[#71809a]"}>{message}</p>)}
                </div>
                <p className="mt-auto pt-8 text-[12px] text-[#8ea0bb]">Estimated time remaining: {activeStageIndex >= 2 ? "a few seconds" : "under a minute"}.</p>
              </aside>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line/80 bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="ClauseGuard home">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-ink text-white shadow-sm"><ShieldIcon /></span>
            <span className="text-[19px] font-bold tracking-[-0.04em]">ClauseGuard</span>
            <span className="hidden rounded-md border border-blue/20 bg-blue-pale px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-blue sm:inline-flex">Analyzer</span>
          </Link>
          <nav className="hidden items-center gap-8 text-[14px] text-slate md:flex" aria-label="Main navigation">
            <Link className="font-semibold text-ink" href="/analyzer">New Scan</Link>
            <Link className="transition-colors hover:text-ink" href="/saved-contracts">Saved Contracts</Link>

            <span className="ml-1 h-8 w-px bg-line" aria-hidden="true" />
            <button type="button" className="rounded-full bg-[#eef2f7] px-3.5 py-2 text-xs font-semibold text-slate transition-colors hover:bg-line">CW</button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 sm:py-11">
        <div className="mb-10 flex items-start gap-3.5 rounded-xl border border-line bg-white px-5 py-4 shadow-card sm:px-6">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff7e7] text-[#bd7b12]" aria-hidden="true">!</span>
          <p className="text-[13px] leading-6 text-slate sm:text-[14px]"><strong className="font-bold tracking-wide text-ink">LEGAL NOTICE:</strong>{" "}ClauseGuard provides an informational first-pass analysis, not professional legal advice, and does not create an attorney-client relationship.</p>
        </div>

        <section aria-labelledby="page-title">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-blue">Contract intelligence</p>
            <h1 id="page-title" className="text-[32px] font-bold tracking-[-0.055em] text-ink sm:text-[42px]">Analyze a new contract</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate sm:text-[16px]">Surface hidden liabilities, unusual clauses, and negotiation priorities before you sign.</p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,1fr)]">
            <div>
              <div className="rounded-xl border border-line bg-white p-5 shadow-card sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="contract-text" className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink">Contract text</label>
                  <span className="hidden items-center gap-1.5 text-[12px] text-muted sm:flex"><LockIcon /> Private workspace</span>
                </div>
                <textarea id="contract-text" value={contractText} onChange={(event) => setContractText(event.target.value)} placeholder="Paste the full legal text here..." className="mt-5 min-h-[370px] w-full resize-y rounded-lg border border-line/80 bg-[#fbfcfe] px-4 py-4 text-[15px] leading-7 text-ink outline-none transition-colors placeholder:font-serif placeholder:text-[#9aaac0] focus:border-blue focus:ring-4 focus:ring-blue/10 sm:min-h-[410px]" />
                <div className="mt-3 flex items-center justify-between gap-4 text-[12px] text-muted">
                  <span>{contractText.length > 0 ? contractText.length.toLocaleString() + " characters" : "Your contract text stays in your workspace."}</span>
                  {fileName && <span className="max-w-[45%] truncate text-blue">{fileName}</span>}
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 flex w-full items-center justify-between rounded-lg border border-dashed border-[#b9c8dc] bg-[#fbfcfe] px-4 py-3 text-left transition-colors hover:border-blue hover:bg-blue-pale/30 lg:hidden">
                  <span className="flex items-center gap-2.5 text-[13px] font-semibold text-ink"><UploadIcon /> {isExtracting ? "Extracting text..." : "Upload a document"}</span>
                  <span className="text-[11px] text-muted">PDF, DOC, DOCX</span>
                </button>
              </div>

              <div className="mt-4 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-2.5">
                  <button type="button" onClick={clearContract} className="rounded-lg border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-slate transition-colors hover:border-ink hover:text-ink">Clear</button>
                  <button type="button" onClick={() => setContractText(sampleContract)} className="rounded-lg border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-slate transition-colors hover:border-ink hover:text-ink">Load sample NDA</button>
                </div>
                <button type="button" disabled={!contractText.trim() || isAnalyzing || cooldownSeconds > 0} onClick={handleAnalyze} className="flex items-center justify-center gap-3 rounded-lg bg-ink px-6 py-3 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(16,26,46,0.12)] transition-all hover:-translate-y-0.5 hover:bg-[#1c2942] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">
                  {isAnalyzing ? "Analyzing contract..." : cooldownSeconds > 0 ? "Try again in " + cooldownSeconds + "s" : "Analyze contract"}
                  {!isAnalyzing && cooldownSeconds === 0 && <ArrowIcon />}
                </button>
              </div>
            </div>

            <button type="button" onClick={() => fileInputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={["group hidden min-h-[545px] lg:flex flex-col items-center justify-center rounded-xl border border-dashed px-8 text-center transition-all", isDragging ? "border-blue bg-blue-pale/60 shadow-[inset_0_0_0_1px_var(--blue)]" : "border-[#b9c8dc] bg-white hover:border-blue hover:bg-blue-pale/30"].join(" ")} aria-label="Upload a contract document">
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFileChange} />
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef3f9] text-slate transition-colors group-hover:bg-blue-pale group-hover:text-blue"><UploadIcon /></span>
              <span className="mt-6 text-[16px] font-semibold text-ink">{fileName || "Upload a contract"}</span>
              <span className="mt-2 max-w-[270px] text-[13px] leading-6 text-muted">{fileName ? "Document selected. Text has been extracted and is ready to analyze." : "Drag and drop a PDF, DOCX, or TXT file here, or click to browse."}</span>
              {!fileName && <span className="mt-5 rounded-md border border-line bg-white px-3 py-2 text-[12px] font-semibold text-slate">Browse files</span>}
              <span className="mt-8 text-[11px] uppercase tracking-[0.12em] text-muted">PDF, DOC, DOCX · 15MB max</span>
            </button>
          </div>

          {(errorMessage || uploadError) && <div role="alert" className="mt-6 rounded-xl border border-red/20 bg-red/5 px-5 py-4 text-sm leading-6 text-red">{errorMessage || uploadError}</div>}


        </section>
      </div>
    </main>
  );
}
