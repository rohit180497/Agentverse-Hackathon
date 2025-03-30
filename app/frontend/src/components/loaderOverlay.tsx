// components/ui/LoaderOverlay.tsx
const LoaderOverlay = () => (


  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="z-60">
      <img
        src="/loader.gif"
        
        className="h-32 w-32 object-contain"
      />
    </div>
  </div>

);

export default LoaderOverlay;