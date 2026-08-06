import type { SessionSegment } from './sessionPlan'

const TEMPLATES_STORAGE_KEY = 'jindo:sessionTemplates'

export interface SessionTemplate {
  id: string
  name: string
  segments: SessionSegment[]
}

export interface SessionTemplateRepository {
  getAll(): SessionTemplate[]
  save(template: SessionTemplate): void
  delete(id: string): void
}

function readTemplates(): SessionTemplate[] {
  const raw = localStorage.getItem(TEMPLATES_STORAGE_KEY)
  if (!raw) return []
  return JSON.parse(raw) as SessionTemplate[]
}

function writeTemplates(templates: SessionTemplate[]): void {
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates))
}

export class LocalStorageSessionTemplateRepository implements SessionTemplateRepository {
  getAll(): SessionTemplate[] {
    return readTemplates()
  }

  save(template: SessionTemplate): void {
    const templates = readTemplates()
    const index = templates.findIndex((existing) => existing.id === template.id)
    if (index === -1) {
      templates.push(template)
    } else {
      templates[index] = template
    }
    writeTemplates(templates)
  }

  delete(id: string): void {
    const templates = readTemplates().filter((existing) => existing.id !== id)
    writeTemplates(templates)
  }
}
