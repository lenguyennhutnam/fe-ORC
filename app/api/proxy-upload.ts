// pages/api/proxy-upload.ts
import fs from 'node:fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import axios from 'axios'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).end()

  const form = new formidable.IncomingForm()
  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err)
      return res.status(500).json({ error: 'Parse error' })

    const file = files.file[0]
    const stream = fs.createReadStream(file.filepath)
    const formData: any = new FormData()
    formData.append('file', stream, file.originalFilename)
    formData.append('user', fields.user[0])

    try {
      const result = await axios.post('https://api.dify.ai/v1/files/upload', formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
        },
      })
      res.status(200).json(result.data)
    }
    catch (e) {
      res.status(500).json({ error: 'Upload failed' })
    }
  })
}
