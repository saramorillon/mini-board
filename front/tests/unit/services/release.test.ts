import mockdate from 'mockdate'
import { Axios } from '../../../src/services/Axios'
import { deleteRelease, getRelease, getReleases, saveRelease } from '../../../src/services/release'
import { mockRelease } from '../../mocks'

vi.mock('../../../src/services/Axios')

mockdate.set('2022-01-01T00:00:00.000Z')

describe('getReleases', () => {
  beforeEach(() => {
    vi.mocked(Axios.get).mockResolvedValue({ data: 'releases' })
  })

  it('should get releases', async () => {
    await getReleases()
    expect(Axios.get).toHaveBeenCalledWith('/api/releases', { params: {} })
  })

  it('should get all releases', async () => {
    await getReleases(true)
    expect(Axios.get).toHaveBeenCalledWith('/api/releases', { params: { all: true } })
  })

  it('should return releases', async () => {
    const result = await getReleases()
    expect(result).toBe('releases')
  })
})

describe('getRelease', () => {
  beforeEach(() => {
    vi.mocked(Axios.get).mockResolvedValue({ data: 'release' })
  })

  it('should return empty release without id', async () => {
    const result = await getRelease()
    expect(result).toEqual({ id: 0, name: '', dueDate: '2022-01-01T00:00:00.000Z' })
  })

  it('should get release', async () => {
    await getRelease('1')
    expect(Axios.get).toHaveBeenCalledWith('/api/releases/1')
  })

  it('should return release', async () => {
    const result = await getRelease('1')
    expect(result).toBe('release')
  })
})

describe('saveRelease', () => {
  it('should post release without id', async () => {
    await saveRelease(mockRelease({ id: 0 }))
    expect(Axios.post).toHaveBeenCalledWith('/api/releases', mockRelease({ id: 0 }))
  })

  it('should patch release with id', async () => {
    await saveRelease(mockRelease())
    expect(Axios.patch).toHaveBeenCalledWith('/api/releases/1', mockRelease())
  })

  it('should return releases path', async () => {
    const path = await saveRelease(mockRelease())
    expect(path).toBe('/releases')
  })
})

describe('deleteRelease', () => {
  it('should delete release', async () => {
    await deleteRelease(mockRelease())
    expect(Axios.delete).toHaveBeenCalledWith('/api/releases/1')
  })

  it('should return releases path', async () => {
    const path = await deleteRelease(mockRelease())
    expect(path).toBe('/releases')
  })
})
