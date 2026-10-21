interface AuthShellProps {
  children: React.ReactNode
}

export const AuthShell = ({ children }: AuthShellProps) => {
  return <div className="grid min-h-svh place-items-center">{children}</div>
}
