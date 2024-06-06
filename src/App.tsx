import { useEffect, useState } from "react";
import "./App.css";
import { Fieldset } from "primereact/fieldset";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/saga-blue/theme.css"; // 选择一个主题
import "primereact/resources/primereact.min.css"; // PrimeReact的核心CSS
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import ReactMarkdown from "react-markdown";
import remarkBreaks from 'remark-breaks';
import { InputTextarea } from "primereact/inputtextarea";
import { BallPulse } from "@alex_xu/react-loading";

function App() {
  const [language, setLanguage] = useState("en"); // ['zh', 'en']
  const { t, i18n } = useTranslation();
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);

  const translate = async (source: string) => {
    // 先清空目标
    setTarget("");
    setLoading(true);

    const bodyData = {
      conversation_id: `11213123`,
      bot_id: "7376994732390023175",
      user: `user669970319021`,
      query: source,
      stream: true,
    };
    const response = await fetch("https://api.coze.com/open_api/v2/chat", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer pat_lUAWIYR8cJ16oU12PDaasS8GZYEaZxOILNlMUI68zXfLBXUi1jPFfZoZfztKwKCm",
        "Content-Type": "application/json",
        Accept: "*/*",
        Host: "api.coze.com",
        Connection: "keep-alive",
      },
      body: JSON.stringify(bodyData),
    });
    const reader = response.body?.getReader();
    if (reader) {
      let result = "";
      setLoading(false);
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim().startsWith("data:")) {
            try {
              const json = JSON.parse(line.trim().substring(5));
              const message = json.message;
              try {
                if (message.type === "answer") {
                  result += message.content;
                  setTarget(result);
                }
              } catch (error) {
                setLoading(false);
                continue;
              }
            } catch (error) {
              setLoading(false);
              continue;
            }
          }
        }
      
      }
    }
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <div className="w-full h-full flex p-3 flex-col gap-4 overflow-hidden transition-all duration-500">
      <PrimeReactProvider>
        <div className="flex justify-end transition-all duration-300 scroll-smooth gap-3">
          <Button
            className="transition-all duration-300 text-xs"
            rounded
            outlined
            onClick={() => {
              setLanguage(language === "zh" ? "en" : "zh");
            }}
          >
            {language === "zh" ? "English" : "中文"}
          </Button>
          <Button
            icon="pi pi-info-circle"
            className="transition-all duration-300 text-xs"
            rounded
            outlined
          />
        </div>
        <Fieldset legend={t("sourceTitle")} className="overflow-auto m-0 rounded-xl">
          <InputTextarea
            className="w-full h-24 p-2 border rounded text-xs"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <div className="flex w-full justify-end">
            <Button className="mt-2 text-xs" onClick={() => translate(source)} rounded >
              {t("translate")}
            </Button>
          </div>
        </Fieldset>
        <Fieldset legend={t("targetTitle")} className="overflow-auto rounded-xl flex-1">
        
          <div className="m-0 text-xs overflow-auto p-0 w-full h-full">
            {loading ? (
              <div className="w-full h-full flex justify-center items-center">
                                <BallPulse text="" size={13} />

              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkBreaks]}
                children={target}
              />
            )}
          </div>
        </Fieldset>
      </PrimeReactProvider>
    </div>
  );
}

export default App;