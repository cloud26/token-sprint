import { NextRequest, NextResponse } from 'next/server'

// 服务端 tokenizer 缓存
const tokenizerCache = new Map<string, any>()

// 动态导入 Transformers.js (服务端)
let AutoTokenizer: any = null

const loadTransformers = async () => {
    if (!AutoTokenizer) {
        try {
            const transformers = await import('@huggingface/transformers')
            AutoTokenizer = transformers.AutoTokenizer
            return transformers.AutoTokenizer
        } catch (error) {
            console.error('Failed to load @huggingface/transformers:', error)
            return null
        }
    }
    return AutoTokenizer
}

// 加载 Hugging Face tokenizer
const loadTokenizer = async (hubPath: string) => {
    try {
        // 检查缓存
        if (tokenizerCache.has(hubPath)) {
            return tokenizerCache.get(hubPath)
        }

        const HFTokenizer = await loadTransformers()
        if (!HFTokenizer) {
            throw new Error('Failed to load Hugging Face Transformers')
        }

        console.log(`Loading tokenizer: ${hubPath}`)
        const tokenizer = await HFTokenizer.from_pretrained(hubPath)

        // 缓存 tokenizer
        tokenizerCache.set(hubPath, tokenizer)
        return tokenizer

    } catch (error: any) {
        console.error('Failed to load tokenizer:', error)
        throw new Error(`Failed to load ${hubPath}: ${error.message}`)
    }
}

export async function POST(request: NextRequest) {
    try {
        const { text, hubPath } = await request.json()

        if (!text || !hubPath) {
            return NextResponse.json(
                { error: 'Missing text or hubPath parameter' },
                { status: 400 }
            )
        }

        // 加载对应的 tokenizer
        const tokenizer = await loadTokenizer(hubPath)
        
        // 进行 tokenization
        const encoded = await tokenizer.encode(text)
        const tokens = await tokenizer.tokenize(text)

        return NextResponse.json({
            success: true,
            tokenCount: encoded.length,
            tokens: tokens,
            tokenIds: Array.from(encoded)
        })

    } catch (error: any) {
        console.error('Tokenization error:', error)
        return NextResponse.json(
            { 
                error: 'Tokenization failed',
                details: error.message 
            },
            { status: 500 }
        )
    }
} 