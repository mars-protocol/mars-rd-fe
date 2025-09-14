import Card from 'components/common/Card'
import { ExternalLink } from 'components/common/Icons'
import Text from 'components/common/Text'

interface BurnSource {
  title: string
  description: string
  url: string
}

const burnSources: BurnSource[] = [
  {
    title: 'Non-Migrated MARS Tokens',
    description:
      'Legacy MARS tokens left unmigrated from Mars Hub (mars-1) to Neutron (neutron-1) during the migration window were permanently burned.',
    url: 'https://daodao.zone/dao/neutron1n3yey5yvlrtzgjam3x0k5auqwf0kealzyeu8zcq7adkjcmys2u5s6wcj9a/proposals/A16',
  },
  {
    title: 'MRC-98 Community Pool Burn',
    description:
      'As part of the comprehensive tokenomics 2.0 upgrade, 300 million MARS tokens were permanently burned from the community pool to reduce total supply and improve tokenomics.',
    url: 'https://forum.marsprotocol.io/t/mrc-98-comprehensive-signaling-proposal-for-mars-protocol/1298',
  },
  {
    title: 'Community Pool Fund Burn',
    description:
      'The Community Pool Fund was burned after contributors decided not to allocate grants to third-party builders, ensuring unused funds were permanently removed.',
    url: 'https://daodao.zone/dao/neutron1pxjszcmmdxwtw9kv533u3hcudl6qahsa42chcs24gervf4ge40usaw3pcr/proposals/A47',
  },
  {
    title: 'Buyback and Burn Program',
    description:
      "40% of Mars Protocol's revenue is allocated to systematic buybacks and burns, driving ongoing deflationary pressure.",
    url: 'https://daodao.zone/dao/neutron1pxjszcmmdxwtw9kv533u3hcudl6qahsa42chcs24gervf4ge40usaw3pcr/proposals/A64',
  },
]

export default function BurnSources() {
  return (
    <Card className='p-8 w-full bg-gradient-to-br border from-red-500/10 to-red-500/5 border-red-500/20'>
      <div className='space-y-6'>
        <div className='space-y-2 text-center'>
          <Text size='2xl' className='font-bold text-white'>
            Deflationary Burn Mechanisms
          </Text>
          <Text size='lg' className='text-white/60'>
            Multiple burn mechanisms continuously reduce MARS supply, creating lasting deflationary
            pressure and supporting long-term token value.
          </Text>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {burnSources.map((source, index) => (
            <Card
              key={index}
              className='p-6 border transition-all duration-300 bg-white/5 border-white/10 hover:border-red-500/30 group hover:bg-red-500/5'
            >
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Text
                    size='lg'
                    className='font-semibold text-white transition-colors group-hover:text-red-400'
                  >
                    {source.title}
                  </Text>
                </div>

                <Text size='sm' className='leading-relaxed text-white/70'>
                  {source.description}
                </Text>

                <a
                  href={source.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center space-x-2 text-sm font-medium text-red-400 transition-colors hover:text-red-300 group-hover:underline'
                >
                  <span>View Governance Proposal</span>
                  <ExternalLink className='w-4 h-4' />
                </a>
              </div>
            </Card>
          ))}
        </div>

        <div className='p-6 bg-gradient-to-r via-transparent rounded-lg border from-red-500/20 to-red-500/20 border-red-500/20'>
          <div className='space-y-3 text-center'>
            <Text size='lg' className='font-semibold text-white'>
              Revenue-Driven Deflation
            </Text>
            <Text className='mx-auto max-w-3xl text-white/80'>
              As Mars Protocol grows, its buyback and burn program ensures more MARS tokens are
              permanently removed from circulation, directly linking protocol success to token
              scarcity.
            </Text>
            <div className='flex justify-center items-center pt-4 space-x-8'>
              <div className='text-center'>
                <Text size='xl' className='font-bold text-red-400'>
                  40%
                </Text>
                <Text size='sm' className='text-white/60'>
                  of Revenue
                </Text>
              </div>
              <div className='text-center'>
                <Text size='xl' className='font-bold text-red-400'>
                  →
                </Text>
              </div>
              <div className='text-center'>
                <Text size='xl' className='font-bold text-red-400'>
                  MARS
                </Text>
                <Text size='sm' className='text-white/60'>
                  Permanently Burned
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
