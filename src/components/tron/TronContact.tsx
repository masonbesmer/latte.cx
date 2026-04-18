import { useState, useEffect, useRef } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function TronContact() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [visibleFields, setVisibleFields] = useState(1);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cursorRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    nameRef.current?.focus();
    cursorRef.current = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => {
      if (cursorRef.current) clearInterval(cursorRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "// ERR: IDENTIFIER TOO SHORT";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "// ERR: INVALID FREQUENCY FORMAT";
    if (message.trim().length < 10)
      e.message = "// ERR: MESSAGE TOO SHORT (MIN 10 CHARS)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function startProgress() {
    setProgress(0);
    const start = performance.now();
    const duration = 2500;
    progressRef.current = setInterval(() => {
      const p = Math.min((performance.now() - start) / duration, 1);
      setProgress(Math.round(p * 100));
      if (p >= 1 && progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
    }, 50);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setFormState("submitting");
    startProgress();
    await new Promise<void>((r) => setTimeout(r, 2700));
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
    setProgress(100);
    await new Promise<void>((r) => setTimeout(r, 300));
    setFormState("success");
  }

  function reset() {
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setFormState("idle");
    setVisibleFields(1);
    setProgress(0);
    setTimeout(() => nameRef.current?.focus(), 50);
  }

  function handleBlur(field: string) {
    if (field === "name" && name.trim().length >= 1 && visibleFields < 2) {
      setVisibleFields(2);
      setTimeout(() => emailRef.current?.focus(), 50);
    } else if (
      field === "email" &&
      email.trim().length >= 1 &&
      visibleFields < 3
    ) {
      setVisibleFields(3);
      setTimeout(() => messageRef.current?.focus(), 50);
    }
  }

  function handleKeydown(e: React.KeyboardEvent, field: string) {
    if (e.key === "Enter" && field !== "message") {
      e.preventDefault();
      handleBlur(field);
    }
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.95rem",
    color: "#FFFFFF",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(0,170,255,0.6)",
    outline: "none",
    padding: "0.4rem 0",
    letterSpacing: "0.05em",
    caretColor: "#FFCC00",
    width: "100%",
  };

  if (formState === "success") {
    return (
      <div role="status" className="tron-terminal-output">
        <p className="tron-output-line" style={{ animationDelay: "0ms" }}>
          <span className="tron-prompt-gt">&gt;</span> TRANSMISSION_RECEIVED:
          TRUE
        </p>
        <p className="tron-output-line" style={{ animationDelay: "300ms" }}>
          <span className="tron-prompt-gt">&gt;</span> SIGNAL_ACK: CONFIRMED
        </p>
        <p className="tron-output-line" style={{ animationDelay: "600ms" }}>
          <span className="tron-prompt-gt">&gt;</span> RESPONSE_ETA: &lt;48H //
          ENCRYPTED_CHANNEL
        </p>
        <button
          className="tron-exec-btn"
          onClick={reset}
          style={{ marginTop: "1.5rem" }}
        >
          &gt; NEW_TRANSMISSION
        </button>
        <style>{`
          .tron-output-line { font-family: 'Share Tech Mono', monospace; font-size: 0.95rem; color: #00AAFF; margin: 0.4rem 0; letter-spacing: 0.05em; text-shadow: 0 0 8px rgba(0,170,255,0.6); opacity: 0; animation: tron-fade-in 0.4s ease forwards; }
          @keyframes tron-fade-in { to { opacity: 1; } }
          .tron-prompt-gt { color: #FFCC00; margin-right: 0.5rem; }
        `}</style>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="tron-terminal-form">
      <div className="tron-field">
        <label className="tron-field-label" htmlFor="tc-name">
          <span className="tron-prompt-gt">&gt;</span> IDENTIFY:
        </label>
        <input
          id="tc-name"
          ref={nameRef}
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => handleBlur("name")}
          onKeyDown={(e) => handleKeydown(e, "name")}
          placeholder="ENTER YOUR NAME"
          readOnly={formState === "submitting"}
          style={{
            ...inputStyle,
            borderBottomColor: errors.name ? "#FF2200" : "rgba(0,170,255,0.6)",
          }}
        />
        {errors.name && <p className="tron-field-error">{errors.name}</p>}
      </div>

      {visibleFields >= 2 && (
        <div className="tron-field tron-field-slide-in">
          <label className="tron-field-label" htmlFor="tc-email">
            <span className="tron-prompt-gt">&gt;</span> FREQUENCY:
          </label>
          <input
            id="tc-email"
            ref={emailRef}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            onKeyDown={(e) => handleKeydown(e, "email")}
            placeholder="YOUR@EMAIL.NET"
            readOnly={formState === "submitting"}
            style={{
              ...inputStyle,
              borderBottomColor: errors.email
                ? "#FF2200"
                : "rgba(0,170,255,0.6)",
            }}
          />
          {errors.email && <p className="tron-field-error">{errors.email}</p>}
        </div>
      )}

      {visibleFields >= 3 && (
        <div className="tron-field tron-field-slide-in">
          <label className="tron-field-label" htmlFor="tc-message">
            <span className="tron-prompt-gt">&gt;</span> ENCODE MESSAGE:
          </label>
          <textarea
            id="tc-message"
            ref={messageRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="ENTER YOUR MESSAGE..."
            rows={5}
            readOnly={formState === "submitting"}
            style={{
              ...inputStyle,
              border: `1px solid ${errors.message ? "#FF2200" : "rgba(0,170,255,0.4)"}`,
              padding: "0.5rem 0.75rem",
              resize: "vertical",
            }}
          />
          {errors.message && (
            <p className="tron-field-error">{errors.message}</p>
          )}
        </div>
      )}

      {formState === "submitting" ? (
        <div className="tron-submitting">
          <p className="tron-field-label">
            <span className="tron-prompt-gt">&gt;</span> UPLINK CONNECTING
            <span
              className="tron-blink"
              style={{ opacity: cursorVisible ? 1 : 0 }}
            >
              ▋
            </span>
          </p>
          <div className="tron-progress-track">
            <div
              className="tron-progress-fill"
              style={{ width: `${progress}%` }}
            />
            <div className="tron-progress-text">{progress}%</div>
          </div>
        </div>
      ) : visibleFields >= 3 ? (
        <button type="submit" className="tron-exec-btn">
          &gt; EXECUTE_TRANSMISSION
        </button>
      ) : (
        <p className="tron-hint">// PRESS ENTER OR TAB TO ADVANCE</p>
      )}

      <style>{`
        .tron-terminal-form, .tron-terminal-output {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }
        .tron-field { display: flex; flex-direction: column; gap: 0.35rem; }
        .tron-field-slide-in { animation: tron-slide-in 0.3s ease forwards; }
        @keyframes tron-slide-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .tron-field-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          color: rgba(0,170,255,0.65);
          letter-spacing: 0.1em;
        }
        .tron-prompt-gt { color: #FFCC00; margin-right: 0.35rem; }
        .tron-field-error {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          color: #FF2200;
          margin: 0;
          text-shadow: 0 0 6px rgba(255,34,0,0.5);
        }
        .tron-exec-btn {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          color: #FFCC00;
          background: transparent;
          border: 1px solid rgba(255,204,0,0.5);
          padding: 0.65rem 1.5rem;
          cursor: pointer;
          text-shadow: 0 0 8px rgba(255,204,0,0.5);
          box-shadow: 0 0 8px rgba(255,204,0,0.15);
          transition: border-color 0.2s, box-shadow 0.2s, color 0.2s;
          align-self: flex-start;
        }
        .tron-exec-btn:hover, .tron-exec-btn:focus-visible {
          border-color: rgba(255,204,0,0.9);
          box-shadow: 0 0 16px rgba(255,204,0,0.4), 0 0 32px rgba(255,204,0,0.15);
          color: #FFFFFF;
          outline: none;
        }
        .tron-hint {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          color: rgba(0,170,255,0.35);
          margin: 0;
          letter-spacing: 0.08em;
        }
        .tron-submitting { display: flex; flex-direction: column; gap: 0.75rem; }
        .tron-progress-track {
          position: relative;
          width: 100%;
          height: 6px;
          background: rgba(0,170,255,0.1);
          border: 1px solid rgba(0,170,255,0.3);
          overflow: hidden;
        }
        .tron-progress-fill {
          height: 100%;
          background: #00AAFF;
          box-shadow: 0 0 8px #00AAFF, 0 0 16px rgba(0,170,255,0.4);
          transition: width 0.1s linear;
        }
        .tron-progress-text {
          position: absolute;
          right: 4px;
          top: -18px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: rgba(0,170,255,0.7);
        }
        .tron-blink { color: #FFCC00; }
      `}</style>
    </form>
  );
}
