export default function ProfileAvatar({ user, size = 34, active = false, style = {} }) {
  const borderColor = active ? 'var(--color-avatar-active-border)' : 'var(--color-border)';
  const background = active ? 'var(--color-avatar-active-bg)' : 'var(--color-beige-mid)';

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2px solid ${borderColor}`,
        background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size > 30 ? '1rem' : '.85rem',
        flexShrink: 0,
        boxShadow: 'var(--shadow-avatar)',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {user?.avatarImg ? (
        <img
          src={user.avatarImg}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <span style={{ lineHeight: 1 }}>{user?.emoji}</span>
      )}
    </div>
  );
}
