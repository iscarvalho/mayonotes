import { pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers';

const MODEL = 'Xenova/multilingual-e5-small';
let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = (
      pipeline('feature-extraction', MODEL, {
        dtype: 'q8',
        progress_callback: (p: unknown) => self.postMessage({ type: 'progress', progress: p }),
      }) as Promise<FeatureExtractionPipeline>
    ).then((extractor) => {
      self.postMessage({ type: 'ready' });
      return extractor;
    });
  }
  return extractorPromise;
}

self.onmessage = async (e: MessageEvent) => {
  // Pré-carregamento: só baixa o modelo
  if (e.data.type === 'load') {
    getExtractor().catch((err) =>
      self.postMessage({ type: 'error', message: (err as Error).message })
    );
    return;
  }

  const { id, texts, kind } = e.data as { id: number; texts: string[]; kind: 'query' | 'passage' };
  try {
    const extractor = await getExtractor();
    const output = await extractor(
      texts.map((t) => `${kind}: ${t}`),
      { pooling: 'mean', normalize: true }
    );
    self.postMessage({ type: 'result', id, embeddings: output.tolist() });
  } catch (err) {
    self.postMessage({ type: 'error', id, message: (err as Error).message });
  }
};