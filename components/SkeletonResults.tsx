export const ResultsSkeleton: React.FunctionComponent = () => (
  <>
    <div className='tile is-ancestor is-horizontal'>
      <ResultSkeleton />
      <ResultSkeleton />
    </div>
    <div className='tile is-ancestor is-horizontal'>
      <ResultSkeleton />
      <ResultSkeleton />
    </div>
    <div className='tile is-ancestor is-horizontal'>
      <ResultSkeleton />
      <ResultSkeleton />
    </div>
    <div className='tile is-ancestor is-horizontal'>
      <ResultSkeleton />
      <ResultSkeleton />
    </div>
  </>
)

const ResultSkeleton: React.FunctionComponent = () => (
  <div className='tile is-parent'>
    <div className='tile is-child card'>
      <div className='card-image'>
        <figure className='image is-16by9 skeleton' />
      </div>
      <div className='card-content'>
        <div className='media'>
          <div className='media-left'>
            <figure className='image is-48x48 skeleton is-circle' />
          </div>
          <div className='media-content'>
            <p className='subtitle is-5 skeleton mb-1'>{' '}</p>
            <p className='subtitle is-7 skeleton skeleton-reverse'>{' '}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)
