const FollowIndicator = (props) => {
  return props.isFollowing ? (
    <span class="text-sm text-orange pr-2">✔</span>
  ) : null
}

export default FollowIndicator
